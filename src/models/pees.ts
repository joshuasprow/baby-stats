import { z } from "zod";
import { EntryBase } from "../lib/entry";

const PeeAmount = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PeeAmount = z.infer<typeof PeeAmount>;

export const Pee = EntryBase.omit({ amount: true }).extend({
  amount: PeeAmount,
});
export type Pee = z.infer<typeof Pee>;

export const PeeAdd = Pee.omit({ id: true });
export type PeeAdd = z.infer<typeof PeeAdd>;
