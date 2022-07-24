import { writable } from "svelte/store";
import type { Entry, Kind } from "./entries";

export type DayState = {
  [K in Kind]: Entry<K>[];
};

export type Days = {
  [timestamp: number]: DayState;
};

const encodeDayTimestamp = (timestamp: Date): number =>
  new Date(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate()
  ).getUTCMilliseconds();

const newEmptyDay = (): DayState => ({
  feeds: [],
  naps: [],
  pees: [],
  poops: [],
});

export const days = writable<Days>({});

export const addEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!$days[ts]) {
      $days[ts] = newEmptyDay();
    }

    $days[ts][kind].push(entry);

    return $days;
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

    return $days;
  });
