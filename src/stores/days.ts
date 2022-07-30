import { derived } from "svelte/store";
import type { Entry } from "../lib/entry";
import type { Kind } from "../lib/kind";
import { feeds } from "./feeds";
import { naps } from "./naps";
import { pees } from "./pees";
import { poops } from "./poops";
import { user } from "./user";

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
  [user, feeds, naps, pees, poops],
  ([_, $feeds, $naps, $pees, $poops]) => {
    const days: Days = {};

    addEntriesToDays(days, "feeds", $feeds || []);
    addEntriesToDays(days, "naps", $naps || []);
    addEntriesToDays(days, "pees", $pees || []);
    addEntriesToDays(days, "poops", $poops || []);

    return days;
  }
);
