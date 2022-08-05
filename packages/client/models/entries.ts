import type { Feed } from "$models/feeds";
import type { Nap } from "$models/naps";
import type { Pee } from "$models/pees";
import type { Poop } from "$models/poops";
import { z } from "zod";

export const ENTRY_KINDS = ["feeds", "naps", "pees", "poops"] as const;
export const EntryKindEnum = z.enum(ENTRY_KINDS);
export type EntryKind = typeof ENTRY_KINDS[number];

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
  ? Nap
  : K extends "pees"
  ? Pee
  : K extends "poops"
  ? Poop
  : never;
