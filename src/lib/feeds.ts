import { newDevDate } from "./dev-date";
import { addEntry, removeEntry } from "./entries";

const FEED_KINDS = ["bottle", "breast"] as const;

export type FeedKind = typeof FEED_KINDS[number];

export type FeedSide = "L" | "R";

export type Feed<K extends FeedKind> = {
  timestamp: Date;
  kind: K;
  amount: number;
} & (K extends "breast" ? { side: FeedSide } : {});

export const addFeed = <K extends FeedKind>(feed: Omit<Feed<K>, "timestamp">) =>
  addEntry("feeds", { ...feed, timestamp: newDevDate() });

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
