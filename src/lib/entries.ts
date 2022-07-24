import {
  days,
  encodeDayTimestamp,
  newEmptyDay,
  sortDaysByTimestamp,
  type DayState,
} from "./days";
import type { Feed } from "./feeds";
import type { Nap } from "./naps";
import type { Pee } from "./pees";
import type { Poop } from "./poops";

export const KINDS = ["feeds", "naps", "pees", "poops"] as const;

export const ICONS_MAP = {
  feeds: "🍼",
  naps: "💤",
  pees: "💧",
  poops: "💩",
} as const;

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

export type Icon<K extends Kind> = typeof ICONS_MAP[K];

export const getIconForKind = <K extends Kind>(kind: K): Icon<K> => {
  const icon = ICONS_MAP[kind];

  if (icon) return icon;

  throw new Error(`Unknown kind: ${kind}`);
};

export const addEntry = <K extends Kind>(kind: K, entry: Entry<K>) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(entry.timestamp);

    if (!$days[ts]) {
      $days[ts] = newEmptyDay();
    }

    $days[ts][kind].push(entry);

    return sortDaysByTimestamp($days);
  });

export const removeEntry = <K extends Kind>(kind: K, timestamp: Date) =>
  days.update(($days) => {
    const ts = encodeDayTimestamp(timestamp);

    if (!$days[ts]) {
      console.error(
        `Tried to remove ${kind} entry from day ${ts} but it doesn't exist`
      );
      return $days;
    }

    const entries = $days[ts][kind].filter(
      (e) => e.timestamp !== timestamp
    ) as DayState[K];

    $days[ts][kind] = entries;

    return sortDaysByTimestamp($days);
  });
