import type { Entry } from "$lib/entry";
import type { Kind } from "$lib/kind";
import { derived } from "svelte/store";
import type { Feed } from "./feeds";
import { feeds } from "./feeds";
import { Nap, naps } from "./naps";
import { pees, type Pee } from "./pees";
import { poops, type Poop } from "./poops";
import { user } from "./user";

type DayEntry<K extends Kind> = [timestamp: number, entry: Entry<K>];

export type Days = [daystamp: number, entries: DayEntry<Kind>[]][];

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

const newDayEntry = <K extends Kind>(entry: Entry<K>): DayEntry<K> => [
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
