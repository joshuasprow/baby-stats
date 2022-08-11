import { z } from "zod";
import { EntryBase } from "./entries";
import { TimeRangeAmount } from "./time";

const NapBase = EntryBase.extend({ kind: z.literal("naps") });

export const NapNext = NapBase.omit({ amount: true }).extend({
  amount: TimeRangeAmount,
});
export type NapNext = z.infer<typeof NapNext>;

export const NapAdd = NapNext.omit({ id: true });
export type NapAdd = z.infer<typeof NapAdd>;
