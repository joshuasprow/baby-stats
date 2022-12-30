import { z } from "zod";
import data from "./tmp/tadpoles-data.json" assert { type: "json" };

const TpEntryType = z.enum([
  "bathroom",
  "nap",
  "note",
  "food",
  "activity",
  "skin_application",
  "medication",
  "health",
]);
type TpEntryType = z.infer<typeof TpEntryType>;

const TpEntry = z.object({
  parent: z.boolean().optional(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  type: TpEntryType,
  bathroom_type: z.literal("diaper").optional(),
  classification: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(", ") : undefined)),
  measure: z.enum(["oz", "F"]).optional(),
  amount_offered: z.number().optional(),
  quantity: z.string().or(z.number()).optional(),
});
type TpEntry = z.infer<typeof TpEntry>;

const entries: TpEntry[] = [];

loop: for (const event of data.events) {
  if (!event.entries) continue;

  for (const entry of event.entries) {
    try {
      const e = TpEntry.parse({
        parent: entry.parent,
        start_time: entry.start_time,
        end_time: entry.end_time,
        type: entry.type,
        bathroom_type: entry.bathroom_type,
        classification: entry.classification,
        measure: entry.measure,
        amount_offered: entry.amount_offered,
        quantity: entry.quantity,
      });

      if (e.type === "bathroom") {
        console.log(entry);
      }

      entries.push(e);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error);
        console.error(entry);
        break loop;
      }
    }
  }
}

// console.table(entries);
// console.log(new Set(entries.map((r) => r.type)));
