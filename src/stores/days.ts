import { derived, writable } from "svelte/store";
import daysData from "../lib/days.data";
import type { Entry, Kind } from "../lib/entries";

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

export const days = writable<Days>(daysData);

days.subscribe(($days) => {
  console.log($days);
});

const sortDaysByTimestamp = ($days: Days): Days =>
  Object.keys($days)
    .sort()
    .reduce((acc, timestamp) => {
      acc[timestamp] = $days[timestamp];
      return acc;
    }, {} as Days);

const isEmptyDay = (day: DayState): boolean =>
  !Object.values(day).some((entries) => entries.length > 0);

export const addEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!$days[ts]) {
      $days[ts] = newEmptyDay();
    }

    $days[ts][kind].push(entry);

    return sortDaysByTimestamp($days);
  });

export const updateEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!$days[ts]) {
      console.error(`No day found for entry: ${entry}`);
      return $days;
    }

    const day = $days[ts];
    const index = day[kind].findIndex(
      (e) => e.timestamp.getTime() === entry.timestamp.getTime()
    );

    day[kind][index] = entry;
    $days[ts] = day;

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

    const entries = $days[ts][kind].filter(
      (e) => e.timestamp !== timestamp
    ) as DayState[K];

    $days[ts][kind] = entries;

    if (isEmptyDay($days[ts])) {
      delete $days[ts];
    }

    return sortDaysByTimestamp($days);
  });
