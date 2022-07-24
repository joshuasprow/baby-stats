import { derived, writable } from "svelte/store";
import type { Entry, Kind } from "./entries";

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

export const days = writable<Days>({});

export const sortDaysByTimestamp = ($days: Days): Days =>
  Object.keys($days)
    .sort()
    .reduce((acc, timestamp) => {
      acc[timestamp] = $days[timestamp];
      return acc;
    }, {} as Days);

export const addEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!$days[ts]) {
      $days[ts] = newEmptyDay();
    }

    $days[ts][kind].push(entry);

    return sortDaysByTimestamp($days);
  });

export const removeEntry = <K extends Kind>(kind: K, timestamp: Date) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(timestamp);

    if (!$days[ts]) {
      console.error(
        `Tried to remove ${kind} entry from day ${ts} but it doesn't exist`
      );
      return $days;
    }

    $days[ts][kind] = $days[ts][kind].filter((e) => e.timestamp !== timestamp);

    return sortDaysByTimestamp($days);
  });
