import type { Entry, EntryKind } from "@baby-stats/models/entries";
import type { Feed } from "@baby-stats/models/feeds";
import type { Nap } from "@baby-stats/models/naps";
import type { Pee } from "@baby-stats/models/pees";
import type { Poop } from "@baby-stats/models/poops";
import type { Timestamp } from "@firebase/firestore";
import { derived } from "svelte/store";
import { baby } from "./baby";
import { feeds } from "./feeds";
import { naps } from "./naps";
import { pees } from "./pees";
import { poops } from "./poops";
import { takeSnapshot } from "./snapshots";
import { user } from "./user";

export type DayEntry<K extends EntryKind> = [
  timestamp: number,
  entry: Entry<K>,
];

export type Day = [daystamp: number, entries: DayEntry<EntryKind>[]];
export type Days = Day[];

export const encodeDayTimestamp = (timestamp: Timestamp): number => {
  const ts = timestamp.toDate();

  const date = new Date(
    ts.getFullYear(),
    ts.getMonth(),
    ts.getDate(),
    0,
    0,
    0,
    0,
  );

  return date.getTime();
};

export const newDayEntry = <K extends EntryKind>(
  entry: Entry<K>,
): DayEntry<K> => [entry.timestamp.toMillis(), entry];

const combineEntries = (
  $feeds: Feed[],
  $naps: Nap[],
  $pees: Pee[],
  $poops: Poop[],
) => {
  const combined = [...$feeds, ...$naps, ...$pees, ...$poops];
  const sorted = combined.sort(
    (a, b) => b.timestamp.seconds - a.timestamp.seconds,
  );

  return sorted;
};

const buildDays = ([$feeds, $naps, $pees, $poops]: [
  Feed[],
  Nap[],
  Pee[],
  Poop[],
]) => {
  const days: Days = [];
  const entries = combineEntries($feeds, $naps, $pees, $poops);

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
  [user, baby, feeds, naps, pees, poops],
  ([$user, $baby, $feeds, $naps, $pees, $poops]) => {
    if (!$user || !$baby) return undefined;

    if (
      $feeds === null ||
      $naps === null ||
      $pees === null ||
      $poops === null
    ) {
      return undefined;
    }

    // calling synchronously so that state isn't blocked from setting
    takeSnapshot($user.uid);

    return buildDays([$feeds, $naps, $pees, $poops]);
  },
);
