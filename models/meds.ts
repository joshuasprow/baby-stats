import { z } from "zod";
import { EntryBase } from "./entries-base";

export const MedUnit = z.enum(["mg", "g", "ml", "tsp", "tbsp", "units"]);
export type MedUnit = z.infer<typeof MedUnit>;

export const Med = EntryBase.extend({
  kind: z.literal("meds"),
  name: z.string(),
  unit: MedUnit,
  amount: z.number().gt(0),
});
export type Med = z.infer<typeof Med>;

export const MedAdd = Med.omit({ id: true });
export type MedAdd = z.infer<typeof MedAdd>;
