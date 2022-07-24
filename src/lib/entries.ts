import type { Feed } from "./feeds";
import type { Nap } from "./naps";
import type { Pee } from "./pees";
import type { Poop } from "./poops";

export const KINDS = ["feeds", "naps", "pees", "poops"] as const;

export type Kind = typeof KINDS[number];

export type Entry<K extends Kind> = K extends "feeds"
  ? Feed
  : K extends "naps"
  ? Nap
  : K extends "pees"
  ? Pee
  : K extends "poops"
  ? Poop
  : never;
