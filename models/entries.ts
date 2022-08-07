import { z } from "zod";
import type { Feed } from "./feeds";
import type { NapNext } from "./naps";
import type { Pee } from "./pees";
import type { Poop } from "./poops";

export const ENTRY_KINDS = ["feeds", "naps", "pees", "poops"] as const;
export const EntryKindEnum = z.enum(ENTRY_KINDS);
export type EntryKind = typeof ENTRY_KINDS[number];

export const ENTRY_ICONS = {
  feeds: {
    bottle: "🍼",
    breast: "🤱",
  },
  naps: "💤",
  pees: "💧",
  poops: "💩",
} as const;
export type EntryIcon<K extends EntryKind> = K extends keyof typeof ENTRY_ICONS
  ? typeof ENTRY_ICONS[K]
  : never;

export const EntryBase = z.object({
  id: z.string().min(1),
  timestamp: z.date(),
  amount: z.number(),
  kind: EntryKindEnum,
});
export type EntryBase = z.infer<typeof EntryBase>;

export type Entry<K extends EntryKind> = K extends "feeds"
  ? Feed
  : K extends "naps"
  ? NapNext
  : K extends "pees"
  ? Pee
  : K extends "poops"
  ? Poop
  : never;

export const TimeRangeAmount = z
  .object({ start: z.date(), end: z.date() })
  .refine((s) => s.start <= s.end, "start must be before end");
export type TimeRangeAmount = z.infer<typeof TimeRangeAmount>;
