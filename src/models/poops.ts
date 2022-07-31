import { EntryBase } from "$lib/entry";
import { z } from "zod";

export const PoopAmount = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PoopAmount = z.infer<typeof PoopAmount>;

export const Poop = EntryBase.omit({ amount: true }).extend({
  amount: PoopAmount,
});
export type Poop = z.infer<typeof Poop>;

export const PoopAdd = Poop.omit({ id: true });
export type PoopAdd = z.infer<typeof PoopAdd>;
