import { z } from "zod";
import { EntryBase } from "./entries";
import { TimeRangeAmount } from "./time";

const FeedSide = z.enum(["L", "R", "LR", "RL"]);
export type FeedSide = z.infer<typeof FeedSide>;

const FeedSource = ["bottle", "breast"] as const;
export type FeedSource = typeof FeedSource[number];

const FeedBase = EntryBase.extend({ kind: z.literal("feeds") });

export const BottleFeed = FeedBase.extend({
  amount: z.number(),
  source: z.literal(FeedSource[0]),
  side: z.null(),
});
export type BottleFeed = z.infer<typeof BottleFeed>;

export const BreastFeed = FeedBase.extend({
  amount: TimeRangeAmount,
  source: z.literal(FeedSource[1]),
  side: FeedSide,
});
export type BreastFeed = z.infer<typeof BreastFeed>;

export const Feed = z.discriminatedUnion("source", [BottleFeed, BreastFeed]);
export type Feed = z.infer<typeof Feed>;

export const FeedAdd = z.discriminatedUnion("source", [
  BottleFeed.omit({ id: true }),
  BreastFeed.omit({ id: true }),
]);
export type FeedAdd = z.infer<typeof FeedAdd>;
