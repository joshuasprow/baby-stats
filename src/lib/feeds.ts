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

const isBottlePartial = (
  value: Record<string, unknown>
): value is Omit<Feed<"bottle">, "timestamp"> => {
  if (typeof value.amount !== "number") return false;

  if (value.kind !== "bottle") return false;

  return true;
};

const isBreastPartial = (
  value: Record<string, unknown>
): value is Omit<Feed<"breast">, "timestamp"> => {
  if (typeof value.amount !== "number") return false;

  if (value.kind !== "breast") return false;

  if (FEED_SIDES.some((s) => s === value.side)) return true;

  return false;
};

export const isFeedPartial = (
  value: Record<string, unknown>
): value is Feed<FeedKind> => isBottlePartial(value) || isBreastPartial(value);

export const addFeed = <K extends FeedKind>(feed: Omit<Feed<K>, "timestamp">) =>
  addEntry("feeds", { ...feed, timestamp: newDevDate() });

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
