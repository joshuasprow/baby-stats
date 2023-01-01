import { Entry } from "@baby-stats/models/entries";
import { EntryKindEnum } from "@baby-stats/models/entries-base";
import { Entry as TpEntry } from "@baby-stats/models/tadpoles";
import { Timestamp } from "@firebase/firestore";
import { parseError } from "./error";
import data from "./tmp/tadpoles-data.json" assert { type: "json" };

const logger = {
  error: (error: unknown, extra = undefined as any) => {
    const e = parseError(error);

    console.error(`\x1b[31mError:\x1b[0m ${e.message}`);

    if (extra) console.error(extra);
  },
};

const parseBathroomTpType = (classification: TpEntry["classification"]) => {
  if (!classification) {
    throw new Error("No classification for bathroom entry");
  }

  const lowercase = classification.toLowerCase();

  if (lowercase.includes("dry")) return null;

  const isPee = lowercase.includes("wet");
  const isPoop = lowercase.includes("bm");

  if (isPee && isPoop) {
    return { pees: EntryKindEnum.Enum.pees, poops: EntryKindEnum.Enum.poops };
  }

  if (isPee) return EntryKindEnum.Enum.pees;
  if (isPoop) return EntryKindEnum.Enum.poops;

  throw new Error(`Unknown classification for bathroom entry: ${lowercase}`);
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

const parseStartTime = ({
  id,
  start_time,
}: Pick<TpEntry, "id" | "start_time">) => {
  if (start_time) return Timestamp.fromMillis(start_time);

  if (!id) {
    console.error({ id, start_time });
    throw new Error("No id or start time");
  }

  const millis = parseInt(id, 10);

  if (isNaN(millis)) throw new Error(`Cannot convert id "${id}" to millis`);

  return Timestamp.fromMillis(millis);
};

const parseTpEntry = (
  tpEntry: TpEntry
): Partial<Entry> | Partial<Entry>[] | null => {
  const kinds = parseTpType(tpEntry);

  if (!kinds) return null;

  const timestamp = parseStartTime(tpEntry);

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
    const tpEntry = TpEntry.parse({
      id: entry.id,
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

    try {
      if (tpEntry.parent) continue;

      parseTpEntry(tpEntry);
    } catch (e) {
      logger.error(e, tpEntry);
      break outer;
    }
  }
}

// console.table(entries);
// console.log(new Set(entries.map((r) => r.type)));
