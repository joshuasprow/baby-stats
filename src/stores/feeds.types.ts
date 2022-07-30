import { z } from "zod";

const FeedKind = ["bottle", "breast"] as const;
export type FeedKind = typeof FeedKind[number];

const FeedSide = z.enum(["L", "R"]);
export type FeedSide = z.infer<typeof FeedSide>;

const BottleFeed = z.object({
  timestamp: z.date(),
  kind: z.literal(FeedKind[0]),
  amount: z.number(),
  side: z.null(),
});

const BreastFeed = z.object({
  timestamp: z.date(),
  kind: z.literal(FeedKind[1]),
  amount: z.number(),
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

export const Feed = z.discriminatedUnion("kind", [BottleFeed, BreastFeed]);
export type Feed = z.infer<typeof Feed>;
