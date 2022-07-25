import { newDevDate } from "./dev-date";
import { addEntry, removeEntry } from "./entries";

const FEED_KINDS = ["bottle", "breast"] as const;

export type FeedKind = typeof FEED_KINDS[number];

const FEED_SIDES = ["L", "R"] as const;

export type FeedSide = typeof FEED_SIDES[number];

export type Feed<K extends FeedKind> = {
  timestamp: Date;
  kind: K;
  amount: number;
} & (K extends "breast" ? { side: FeedSide } : {});

type FeedAdd<K extends FeedKind> = Omit<Feed<K>, "timestamp">;

export const isFeedAdd = (
  value: Record<string, unknown>
): value is FeedAdd<FeedKind> => {
  if (typeof value.amount !== "number") return false;

  if (!FEED_KINDS.includes(value.kind as FeedKind)) return false;

  if (value.kind === "bottle") return true;

  if (value.kind !== "breast") return false;

  if (!FEED_SIDES.includes(value.side as FeedSide)) return false;

  return true;
};

export const addFeed = <K extends FeedKind>(feed: FeedAdd<K>) =>
  addEntry("feeds", { ...feed, timestamp: newDevDate() });

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
