import type { Entry, EntryKind } from "baby-stats-models/entries";
import type { Feed } from "baby-stats-models/feeds";
import type { Nap } from "baby-stats-models/naps";
import type { Pee } from "baby-stats-models/pees";
import type { Poop } from "baby-stats-models/poops";
import { derived } from "svelte/store";
import { feeds } from "./feeds";
import { naps } from "./naps";
import { pees } from "./pees";
import { poops } from "./poops";
import { user } from "./user";

type DayEntry<K extends EntryKind> = [timestamp: number, entry: Entry<K>];

export type Days = [daystamp: number, entries: DayEntry<EntryKind>[]][];

const encodeDayTimestamp = (timestamp: Date): number => {
  const date = new Date(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate(),
    0,
    0,
    0,
    0
  );

  return date.getTime();
};

const newDayEntry = <K extends EntryKind>(entry: Entry<K>): DayEntry<K> => [
  entry.timestamp.getTime(),
  entry,
];

const combineEntries = (
  $feeds: Feed[],
  $naps: Nap[],
  $pees: Pee[],
  $poops: Poop[]
) => {
  const combined = [...$feeds, ...$naps, ...$pees, ...$poops];
  const sorted = combined.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return sorted;
};

export const days = derived(
  [user, feeds, naps, pees, poops],
  ([_, $feeds = [], $naps = [], $pees = [], $poops = []]) => {
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
  }
);
