import { z } from "zod";
import { EntryBase } from "./entries";
import { TimeRangeAmount } from "./time";

const NapBase = EntryBase.extend({ kind: z.literal("naps") });

export const Nap = NapBase.omit({ amount: true }).extend({
  amount: TimeRangeAmount,
});
export type Nap = z.infer<typeof Nap>;

export const NapAdd = Nap.omit({ id: true });
export type NapAdd = z.infer<typeof NapAdd>;
