import { newDevDate } from "./dev-date";
import { addEntry, removeEntry } from "./entries";

const FEED_KINDS = ["bottle", "breast"] as const;

export type FeedKind = typeof FEED_KINDS[number];

type FeedSide<K extends FeedKind> = K extends "breast"
  ? "L" | "R"
  : K extends "bottle"
  ? null
  : never;

export interface Feed<K extends FeedKind> {
  timestamp: Date;
  kind: K;
  side: FeedSide<K>;
}

export const addFeed = <K extends FeedKind>(feed: Omit<Feed<K>, "timestamp">) =>
  addEntry("feeds", { ...feed, timestamp: newDevDate() });

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
