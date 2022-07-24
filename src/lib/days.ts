import { writable } from "svelte/store";
import type { Entry, Kind } from "./entries";
import type { Feed } from "./feeds";

export interface Day {
  year: number;
  month: number;
  date: number;
}

export type DayState = {
  [K in Kind]: Entry<K>[];
};

export type Days = {
  [day: string]: DayState;
};

export const encodeDay = (day: Day): string =>
  `${day.year}-${day.month}-${day.date}`;

export const encodeTimestamp = (timestamp: Date): string =>
  `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;

export const decodeDay = (day: string): Day => {
  const [year, month, date] = day.split("-").map(Number);
  return { year, month, date };
};

export const days = writable<Days>({});

const newEmptyDay = (): DayState => ({
  feeds: [],
  naps: [],
  pees: [],
  poops: [],
});

export const addEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const day = encodeTimestamp(entry.timestamp);

    if (!$days[day]) {
      $days[day] = newEmptyDay();
    }

    $days[day][kind].push(entry);

    return $days;
  });

export const removeEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const day = encodeTimestamp(entry.timestamp);

    if (!$days[day]) {
      console.error(
        `Tried to remove entry from day ${day} but it doesn't exist`
      );
      return $days;
    }

    $days[day][kind] = $days[day][kind].filter(
      (e) => e.timestamp !== entry.timestamp
    );

    return $days;
  });

export const addFeed = (feed: Feed) => addEntry("feeds", feed);

export const removeFeed = (timestamp: Date) =>
  days.update(($days) => {
    const day = encodeTimestamp(timestamp);

    if (!$days[day]) {
      return $days;
    }

    $days[day].feeds = $days[day].feeds.filter(
      (feed) => feed.timestamp !== timestamp
    );

    return $days;
  });
