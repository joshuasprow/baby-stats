import { z } from "zod";
import data from "./tmp/tadpoles-data.json" assert { type: "json" };
import { Entry } from "@baby-stats/models/entries";
import { Timestamp } from "@firebase/firestore";
import { EntryKind, EntryKindEnum } from "@baby-stats/models/entries-base";
import { Entry as TpEntry } from "@baby-stats/models/tadpoles";

// const TpEntryType = z.enum([
//   "bathroom",
//   "nap",
//   "note",
//   "food",
//   "activity",
//   "skin_application",
//   "medication",
//   "health",
// ]);
// type TpEntryType = z.infer<typeof TpEntryType>;

// const TpEntry = z.object({
//   parent: z.boolean().optional(),
//   start_time: z.number().optional(),
//   end_time: z.number().optional(),
//   type: TpEntryType,
//   bathroom_type: z.literal("diaper").optional(),
//   classification: z
//     .string()
//     .optional()
//     .transform((s) =>
//       s ? s.split(", ").map((c) => c.toLowerCase()) : undefined
//     ),
//   measure: z.enum(["oz", "F"]).optional(),
//   amount_offered: z.number().optional(),
//   quantity: z.string().or(z.number()).optional(),
// });
// type TpEntry = z.infer<typeof TpEntry>;

const parseBathroomTpType = (classification: TpEntry["classification"]) => {
  if (!classification) {
    throw new Error("No classification for bathroom entry");
  }

  if (classification.includes("dry")) return null;

  const isPee = classification.includes("wet");
  const isPoop = classification.includes("bm");

  if (isPee && isPoop) {
    return { pees: EntryKindEnum.Enum.pees, poops: EntryKindEnum.Enum.poops };
  }

  if (isPee) return EntryKindEnum.Enum.pees;
  if (isPoop) return EntryKindEnum.Enum.poops;

  throw new Error(
    `Unknown classification for bathroom entry: ${classification}`
  );
};

const parseTpType = ({
  type,
  classification,
}: Pick<TpEntry, "type" | "classification">) => {
  switch (type) {
    case "bathroom":
      return parseBathroomTpType(classification);
    case "nap":
      return "naps";
    case "food":
      return "feeds";
    case "medication":
      return "meds";
    default:
      return null;
  }
};

const parseTpEntry = (
  tpEntry: TpEntry
): Partial<Entry> | Partial<Entry>[] | null => {
  const kinds = parseTpType(tpEntry);

  if (!kinds) return null;

  const { start_time } = tpEntry;

  if (!start_time) throw new Error("No start time");

  const timestamp = Timestamp.fromMillis(start_time);

  if (typeof kinds === "string") {
    const entry: Partial<Entry> = {
      timestamp,
      kind: kinds,
    };

    return entry;
  }

  const pee: Partial<Entry> = { timestamp, kind: kinds.pees };
  const poop: Partial<Entry> = { timestamp, kind: kinds.poops };

  return [pee, poop];
};

outer: for (const event of data.events) {
  if (!event.entries) continue;

  for (const entry of event.entries) {
    try {
      const tpEntry = TpEntry.parse({
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

      if (tpEntry.parent) continue;

      parseTpEntry(tpEntry);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error(e.message);
        console.error(entry);
      } else {
        throw e;
      }
      break outer;
    }
  }
}

// console.table(entries);
// console.log(new Set(entries.map((r) => r.type)));
