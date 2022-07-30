import { z } from "zod";
import type { Feed } from "../stores/feeds.types";
import type { Nap } from "../stores/naps";
import type { Pee } from "../stores/pees";
import type { Poop } from "../stores/poops";
import type { Kind } from "./kind";

export const EntryBase = z.object({
  timestamp: z.date(),
  amount: z.number(),
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
