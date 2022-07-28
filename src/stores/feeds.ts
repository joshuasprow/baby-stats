import { newTimestampWithPickerDate } from "./picker-date";
import { addEntry, removeEntry, updateEntry } from "./days";

const FEED_KINDS = ["bottle", "breast"] as const;

export type FeedKind = typeof FEED_KINDS[number];

const FEED_SIDES = ["L", "R"] as const;

export type FeedSide = typeof FEED_SIDES[number];

export type Feed<K extends FeedKind> = {
  timestamp: Date;
  kind: K;
  amount: number;
  side: FeedSide | undefined;
};

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

export const isFeed = <K extends FeedKind>(
  value: Record<string, unknown>
): value is Feed<K> => {
  if (!isFeedAdd(value)) return false;

  if (!((value as Feed<"breast">).timestamp instanceof Date)) return false;

  return true;
};

export const isBreastFeed = (
  value: Record<string, unknown>
): value is Feed<"breast"> => {
  if (!isFeed(value)) return false;

  if (value.kind !== "breast") return false;

  return true;
};

export const addFeed = <K extends FeedKind>(feed: FeedAdd<K>) =>
  addEntry("feeds", { ...feed, timestamp: newTimestampWithPickerDate() });

export const updateFeed = <K extends FeedKind>(feed: Feed<K>) =>
  updateEntry("feeds", feed);

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);
