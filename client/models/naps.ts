import { EntryBase } from "$models/entries";
import { z } from "zod";

export const Nap = EntryBase.omit({ amount: true }).extend({
  amount: z.number().positive(),
});
export type Nap = z.infer<typeof Nap>;

export const NapAdd = Nap.omit({ id: true });
export type NapAdd = z.infer<typeof NapAdd>;
