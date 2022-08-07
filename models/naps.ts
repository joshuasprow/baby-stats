import { z } from "zod";
import { EntryBase, TimeRangeAmount } from "./entries";

// TODO: remove number amount after migrating all records
export const Nap = EntryBase.omit({ amount: true }).extend({
  amount: z.number().positive(),
});
export type Nap = z.infer<typeof Nap>;

export const NapNext = EntryBase.omit({ amount: true }).extend({
  amount: TimeRangeAmount,
});
export type NapNext = z.infer<typeof NapNext>;

export const NapAdd = NapNext.omit({ id: true });
export type NapAdd = z.infer<typeof NapAdd>;
