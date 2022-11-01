import type { Entry, EntryKind } from "@baby-stats/models/entries";
import type { Timestamp } from "@firebase/firestore";
import { derived } from "svelte/store";
import { db } from "../firebase";
import { subscribeToEntries } from "../firebase/entries";
import { baby } from "./baby";

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

const groupEntriesByDay = (entries: Entry<EntryKind>[]) => {
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

    const setByDay = (_entries: Entry<EntryKind>[]) =>
      set(groupEntriesByDay(_entries));

    unsubscribe = subscribeToEntries(db, $baby.id, setByDay);

    return unsubscribe;
  },
);
