import { writable } from "svelte/store";
import { addEntry, removeEntry } from "./days";

export interface Feed {
  timestamp: Date;
}

export const addFeed = (feed: Feed) => addEntry("feeds", feed);

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
