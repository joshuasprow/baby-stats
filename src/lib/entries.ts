import type { Feed } from "./feeds";
import type { Nap } from "./naps";
import type { Pee } from "./pees";
import type { Poop } from "./poops";

export const KINDS = ["feed", "nap", "pee", "poop"] as const;

export type Kind = typeof KINDS[number];

export type Entry<K extends Kind> = K extends "feed"
  ? Feed
  : K extends "nap"
  ? Nap
  : K extends "pee"
  ? Pee
  : K extends "poop"
  ? Poop
  : never;
