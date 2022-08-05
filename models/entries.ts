import { z } from "zod";
import type { Feed } from "./feeds";
import type { Nap } from "./naps";
import type { Pee } from "./pees";
import type { Poop } from "./poops";

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
