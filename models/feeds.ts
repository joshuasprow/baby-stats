import { z } from "zod";
import { EntryBase } from "./entries";

const FeedSide = z.enum(["L", "R", "LR", "RL"]);
export type FeedSide = z.infer<typeof FeedSide>;

const FeedSource = ["bottle", "breast"] as const;
export type FeedSource = typeof FeedSource[number];

export const FeedValue = z.object({
  side: FeedSide,
  source: z.enum(FeedSource),
});
export type FeedValue = z.infer<typeof FeedValue>;

export const BottleFeed = EntryBase.extend({
  source: z.literal(FeedSource[0]),
  side: z.null(),
});
export type BottleFeed = z.infer<typeof BottleFeed>;

const BreastFeedAmount = z
  .object({ start: z.date(), end: z.date() })
  .refine((s) => s.start <= s.end, "start must be before end");
export type BreastFeedAmount = z.infer<typeof BreastFeedAmount>;

export const BreastFeed = EntryBase.extend({
  amount: z.number().or(BreastFeedAmount),
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
