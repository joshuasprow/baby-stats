import { addEntry, removeEntry } from "./entries";

export interface Feed {
  timestamp: Date;
}

export const addFeed = (feed: Feed) => addEntry("feeds", feed);

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
