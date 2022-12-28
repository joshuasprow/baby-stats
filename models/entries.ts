import type { z } from "zod";
import { Feed, FeedAdd } from "./feeds";
import { Med, MedAdd } from "./meds";
import { Nap, NapAdd } from "./naps";
import { Pee, PeeAdd } from "./pees";
import { Poop, PoopAdd } from "./poops";

export const Entry = Feed.or(Med).or(Nap).or(Pee).or(Poop);
export type Entry = z.infer<typeof Entry>;

export const EntryAdd = FeedAdd.or(MedAdd).or(NapAdd).or(PeeAdd).or(PoopAdd);
export type EntryAdd = z.infer<typeof EntryAdd>;
