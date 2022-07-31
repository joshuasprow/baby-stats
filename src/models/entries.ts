import type { Feed } from "$models/feeds";
import type { Nap } from "$models/naps";
import type { Pee } from "$models/pees";
import type { Poop } from "$models/poops";
import { z } from "zod";
import { KindEnum, type Kind } from "../lib/kind";

export const EntryBase = z.object({
  id: z.string().min(1),
  timestamp: z.date(),
  amount: z.number(),
  kind: KindEnum,
});
export type EntryBase = z.infer<typeof EntryBase>;

export type Entry<K extends Kind> = K extends "feeds"
  ? Feed
  : K extends "naps"
  ? Nap
  : K extends "pees"
  ? Pee
  : K extends "poops"
  ? Poop
  : never;
