import {
  days,
  encodeDayTimestamp,
  newEmptyDay,
  sortDaysByTimestamp,
} from "./days";
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

export type Icon<K extends Kind> = K extends "feeds"
  ? "🍼"
  : K extends "naps"
  ? "💤"
  : K extends "pees"
  ? "💧"
  : K extends "poops"
  ? "💩"
  : never;

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

    $days[ts][kind] = $days[ts][kind].filter((e) => e.timestamp !== timestamp);

    return sortDaysByTimestamp($days);
  });
