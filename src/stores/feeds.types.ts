import { z } from "zod";
import { EntryBase } from "$lib/entry";

const FeedSide = z.enum(["L", "R"]);
export type FeedSide = z.infer<typeof FeedSide>;

const FeedSource = ["bottle", "breast"] as const;
export type FeedSource = typeof FeedSource[number];

const BottleFeed = EntryBase.extend({
  source: z.literal(FeedSource[0]),
  side: z.null(),
});

const BreastFeed = EntryBase.extend({
  source: z.literal(FeedSource[1]),
  side: FeedSide,
});

export const Feed = z.discriminatedUnion("source", [BottleFeed, BreastFeed]);
export type Feed = z.infer<typeof Feed>;
