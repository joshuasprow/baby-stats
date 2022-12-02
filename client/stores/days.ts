import { parseError } from "@baby-stats/lib/error";
import type { Entry } from "@baby-stats/models/entries";
import type { Timestamp } from "@firebase/firestore";
import { derived } from "svelte/store";
import { setGlobalError } from "../components/GlobalError.svelte";
import { db } from "../firebase";
import { subscribeToEntries } from "../firebase/entries";
import logger from "../lib/logger";
import { baby } from "./baby";

export type DayEntry = [timestamp: number, entry: Entry];

export type Day = [daystamp: number, entries: DayEntry[]];
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

export const newDayEntry = (entry: Entry): DayEntry => [
  entry.timestamp.toMillis(),
  entry,
];

const groupEntriesByDay = (entries: Entry[]) => {
  const _days: Day[] = [];

  for (const entry of entries) {
    const daystamp = encodeDayTimestamp(entry.timestamp);
    const dayEntry = newDayEntry(entry);

    const day = _days.find(([ds]) => ds === daystamp);

    if (day) {
      day[1].push(dayEntry);
      _days[daystamp] = day;
      continue;
    }

    _days.push([daystamp, [dayEntry]]);
  }

  return _days;
};

export const days = derived<typeof baby, Day[] | undefined>(
  baby,
  ($baby, set) => {
    let unsubscribe = () => {};

    if (!$baby) {
      set(undefined);
      return unsubscribe;
    }

    const setByDay = (_entries: Entry[]) => set(groupEntriesByDay(_entries));

    try {
      unsubscribe = subscribeToEntries(db, $baby.id, setByDay);
    } catch (e) {
      const error = parseError(e, "SubscribeToEntriesError");
      logger.error(error);
      setGlobalError(error);

      unsubscribe = () => {};
    }

    return unsubscribe;
  },
);
