import { writable } from "svelte/store";

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
