import type { Kind } from "./kind";

export const ICONS_MAP = {
  feeds: "🍼",
  naps: "💤",
  pees: "💧",
  poops: "💩",
} as const;

export type Icon<K extends Kind> = typeof ICONS_MAP[K];

export const getIconForKind = <K extends Kind>(kind: K): Icon<K> => {
  const icon = ICONS_MAP[kind];

  if (icon) return icon;

  throw new Error(`Unknown kind: ${kind}`);
};
