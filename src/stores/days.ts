import { derived, writable } from "svelte/store";
import daysData from "../lib/days.data";
import type { Entry, Kind } from "../lib/entries";

export type DayState = {
  [K in Kind]: Entry<K>[];
};

export type Days = {
  [timestamp: string]: DayState;
};

export const encodeDayTimestamp = (timestamp: Date): string => {
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

export const newEmptyDay = (): DayState => ({
  feeds: [],
  naps: [],
  pees: [],
  poops: [],
});

export const days = writable<Days>(daysData);

days.subscribe(($days) => {
  console.log($days);
});

export const sortDaysByTimestamp = ($days: Days): Days =>
  Object.keys($days)
    .sort()
    .reduce((acc, timestamp) => {
      acc[timestamp] = $days[timestamp];
      return acc;
    }, {} as Days);

export const isEmptyDay = (day: DayState): boolean =>
  !Object.values(day).some((entries) => entries.length > 0);
