import { writable } from "svelte/store";
import type { Feed } from "./feeds";

export interface Day {
  year: number;
  month: number;
  date: number;
}

export interface DayState {
  feeds: Feed[];
}

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

export const addFeed = (feed: Feed) =>
  days.update(($days) => {
    const day = encodeTimestamp(feed.timestamp);

    if (!$days[day]) {
      $days[day] = { feeds: [] };
    }

    $days[day].feeds.push(feed);

    return $days;
  });

export const removeFeed = (timestamp: Date) =>
  days.update(($days) => {
    const day = encodeTimestamp(timestamp);

    if (!$days[day]) {
      return $days;
    }

    $days[day].feeds = $days[day].feeds.filter(
      (feed) => feed.timestamp !== timestamp
    );

    if ($days[day].feeds.length === 0) {
      delete $days[day];
    }

    return $days;
  });
