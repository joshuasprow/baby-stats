import type { Feed, FeedKind } from "../stores/feeds";
import type { Nap } from "../stores/naps";
import type { Pee } from "../stores/pees";
import type { Poop } from "../stores/poops";

export const KINDS = ["feeds", "naps", "pees", "poops"] as const;

export const ICONS_MAP = {
  feeds: "🍼",
  naps: "💤",
  pees: "💧",
  poops: "💩",
} as const;

export type Kind = typeof KINDS[number];

export type Entry<K extends Kind> = K extends "feeds"
  ? Feed<FeedKind>
  : K extends "naps"
  ? Nap
  : K extends "pees"
  ? Pee
  : K extends "poops"
  ? Poop
  : never;

export type Icon<K extends Kind> = typeof ICONS_MAP[K];

export const getIconForKind = <K extends Kind>(kind: K): Icon<K> => {
  const icon = ICONS_MAP[kind];

  if (icon) return icon;

  throw new Error(`Unknown kind: ${kind}`);
};
