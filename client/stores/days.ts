import type { Entry, EntryKind } from "baby-stats-models/entries";
import type { Feed } from "baby-stats-models/feeds";
import type { NapNext } from "baby-stats-models/naps";
import type { Pee } from "baby-stats-models/pees";
import type { Poop } from "baby-stats-models/poops";
import type { Timestamp } from "firebase/firestore";
import { derived } from "svelte/store";
import { feeds } from "./feeds";
import { naps } from "./naps";
import { pees } from "./pees";
import { poops } from "./poops";
import { takeSnapshot } from "./snapshots";
import { user } from "./user";

export type DayEntry<K extends EntryKind> = [
  timestamp: number,
  entry: Entry<K>
];

export type Day = [daystamp: number, entries: DayEntry<EntryKind>[]];
export type Days = Day[];

const encodeDayTimestamp = (timestamp: Timestamp): number => {
  const ts = timestamp.toDate();

  const date = new Date(
    ts.getFullYear(),
    ts.getMonth(),
    ts.getDate(),
    0,
    0,
    0,
    0
  );

  return date.getTime();
};

const newDayEntry = <K extends EntryKind>(entry: Entry<K>): DayEntry<K> => [
  entry.timestamp.toMillis(),
  entry,
];

const combineEntries = (
  $feeds: Feed[],
  $naps: NapNext[],
  $pees: Pee[],
  $poops: Poop[]
) => {
  const combined = [...$feeds, ...$naps, ...$pees, ...$poops];
  const sorted = combined.sort(
    (a, b) => b.timestamp.seconds - a.timestamp.seconds
  );

  return sorted;
};

const buildDays = ([_feeds = [], _naps = [], _pees = [], _poops = []]: [
  Feed[],
  NapNext[],
  Pee[],
  Poop[]
]) => {
  const days: Days = [];
  const entries = combineEntries(_feeds, _naps, _pees, _poops);

  for (const entry of entries) {
    const daystamp = encodeDayTimestamp(entry.timestamp);
    const dayEntry = newDayEntry(entry);

    const day = days.find(([ds]) => ds === daystamp);

    if (day) {
      day[1].push(dayEntry);
      days[daystamp] = day;
      continue;
    }

    days.push([daystamp, [dayEntry]]);
  }

  return days;
};

export const days = derived(
  [user, feeds, naps, pees, poops],
  ([_user, ...stores]) => {
    if (!_user) return [];

    // calling synchronously so that state isn't blocked from setting
    takeSnapshot(_user.uid);

    return buildDays(stores);
  }
);
