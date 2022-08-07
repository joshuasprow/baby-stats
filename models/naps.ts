import { z } from "zod";
import { EntryBase } from "./entries";
import { TimeRangeAmount } from "./time-ranges";

const NapBase = EntryBase.extend({ kind: z.literal("naps") });

// TODO: remove number amount after migrating all records
export const Nap = NapBase.omit({ amount: true }).extend({
  amount: z.number().positive(),
});
export type Nap = z.infer<typeof Nap>;

export const NapNext = NapBase.omit({ amount: true }).extend({
  amount: TimeRangeAmount,
});
export type NapNext = z.infer<typeof NapNext>;

export const NapAdd = NapNext.omit({ id: true });
export type NapAdd = z.infer<typeof NapAdd>;
