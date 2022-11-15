import { Timestamp } from "@firebase/firestore";
import { z } from "zod";
import { Feed, FeedAdd } from "./feeds";
import { Med, MedAdd } from "./meds";
import { Nap, NapAdd } from "./naps";
import { Pee, PeeAdd } from "./pees";
import { Poop, PoopAdd } from "./poops";

export const ENTRY_KINDS = ["feeds", "meds", "naps", "pees", "poops"] as const;
export const EntryKindEnum = z.enum(ENTRY_KINDS);
export type EntryKind = typeof ENTRY_KINDS[number];

export const ENTRY_ICONS = {
  feeds: {
    bottle: "🍼",
    breast: "🤱",
  },
  meds: "💊",
  naps: "💤",
  pees: "💧",
  poops: "💩",
} as const;
export type EntryIcon<K extends EntryKind> = K extends keyof typeof ENTRY_ICONS
  ? typeof ENTRY_ICONS[K]
  : never;

export const EntryBase = z.object({
  id: z.string().min(1),
  babyId: z.string().min(1),
  userId: z.string().min(1),
  timestamp: z.instanceof(Timestamp),
  kind: EntryKindEnum,
});
export type EntryBase = z.infer<typeof EntryBase>;

export type Entry = Feed | Med | Nap | Pee | Poop;
export type EntryAdd = FeedAdd | MedAdd | NapAdd | PeeAdd | PoopAdd;
