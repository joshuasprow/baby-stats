import { Entry } from "src/lib/entry";
import { z } from "zod";

const FeedSide = z.enum(["L", "R"]);
export type FeedSide = z.infer<typeof FeedSide>;

const FeedSource = ["bottle", "breast"] as const;
export type FeedSource = typeof FeedSource[number];

const BottleFeed = Entry.extend({
  source: z.literal(FeedSource[0]),
  side: z.null(),
});

const BreastFeed = Entry.extend({
  source: z.literal(FeedSource[1]),
  side: FeedSide,
});
type BreastFeed = z.infer<typeof BreastFeed>;

export const isBreastFeed = (value: unknown): value is BreastFeed => {
  try {
    BreastFeed.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const Feed = z.discriminatedUnion("source", [BottleFeed, BreastFeed]);
export type Feed = z.infer<typeof Feed>;
