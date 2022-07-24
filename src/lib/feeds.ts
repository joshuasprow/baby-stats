import { derived, writable } from "svelte/store";
import type { Day } from "./entries";

export interface Feed {
  timestamp: Date;
}

export const feeds = writable<Feed[]>([]);

export const addFeed = () =>
  feeds.update(($feeds) => [...$feeds, { timestamp: new Date() }]);

export const removeFeed = (timestamp: Date) =>
  feeds.update(($feeds) =>
    $feeds.filter((feed) => feed.timestamp !== timestamp)
  );

export const feedsByDay = derived(feeds, ($feeds): Map<Day, Feed[]> => {
  const $feedsByDay = new Map<Day, Feed[]>();

  for (const feed of $feeds) {
    const day = {
      year: feed.timestamp.getFullYear(),
      month: feed.timestamp.getMonth(),
      day: feed.timestamp.getDate(),
    };

    const dayFeeds = $feedsByDay.get(day) || [];

    $feedsByDay.set(day, [...dayFeeds, feed]);
  }

  return $feedsByDay;
});
