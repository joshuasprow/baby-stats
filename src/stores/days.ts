import type { Entry } from "src/lib/entry";
import type { Kind } from "src/lib/kind";
import { derived } from "svelte/store";
import { feeds } from "./feeds";
import { naps } from "./naps";
import { pees } from "./pees";
import { poops } from "./poops";

export type DayState = {
  [K in Kind]: Entry<K>[];
};

export type Days = {
  [timestamp: string]: DayState;
};

const encodeDayTimestamp = (timestamp: Date): string => {
  const date = new Date(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate(),
    0,
    0,
    0,
    0
  );

  return date.getTime().toString();
};

const newEmptyDay = (): DayState => ({
  feeds: [],
  naps: [],
  pees: [],
  poops: [],
});

const addEntriesToDays = <K extends Kind>(
  days: Days,
  kind: K,
  entries: Entry<K>[]
): Days => {
  for (const entry of entries) {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!days[ts]) {
      days[ts] = newEmptyDay();
    }

    days[ts][kind].push(entry);
  }

  return days;
};

export const days = derived(
  [feeds, naps, pees, poops],
  ([$feeds, $naps, $pees, $poops]) => {
    const days: Days = {};

    addEntriesToDays(days, "feeds", $feeds);
    addEntriesToDays(days, "naps", $naps);
    addEntriesToDays(days, "pees", $pees);
    addEntriesToDays(days, "poops", $poops);

    return days;
  }
);
