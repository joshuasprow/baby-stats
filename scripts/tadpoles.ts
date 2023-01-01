import { Entry } from "@baby-stats/models/entries";
import { EntryKind, EntryKindEnum } from "@baby-stats/models/entries-base";
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

const parseBathroomTpType = (
  classification: TpEntry["classification"]
): EntryKind[] => {
  if (!classification) {
    throw new Error("No classification for bathroom entry");
  }

  const lowercase = classification.toLowerCase();

  if (lowercase.includes("dry")) return [];

  const isPee = lowercase.includes("wet");
  const isPoop = lowercase.includes("bm");

  if (isPee && isPoop) {
    return [EntryKindEnum.Enum.pees, EntryKindEnum.Enum.poops];
  }

  if (isPee) return [EntryKindEnum.Enum.pees];
  if (isPoop) return [EntryKindEnum.Enum.poops];

  throw new Error(`Unknown classification for bathroom entry: ${lowercase}`);
};

const parseTpType = ({
  type,
  classification,
}: Pick<TpEntry, "type" | "classification">): EntryKind[] => {
  switch (type) {
    case "bathroom":
      return parseBathroomTpType(classification);
    case "nap":
      return ["naps"];
    case "food":
      return ["feeds"];
    case "medication":
      return ["meds"];
    default:
      return [];
  }
};

const parseStartTime = ({
  id,
  start_time,
}: Pick<TpEntry, "id" | "start_time">) => {
  if (start_time) return Timestamp.fromMillis(start_time);

  if (!id) throw new Error("No id or start time");

  const millis = parseInt(id, 10);

  if (isNaN(millis)) throw new Error(`Cannot convert id "${id}" to millis`);

  return Timestamp.fromMillis(millis);
};

const parseTpEntry = (value: unknown) => {
  const tpEntry = TpEntry.parse(value);

  if (tpEntry.parent) return null;

  const kinds = parseTpType(tpEntry);

  if (!kinds.length) return null;

  const timestamp = parseStartTime(tpEntry);

  const entries: Partial<Entry>[] = [];

  for (const kind of kinds) {
    const entry: Partial<Entry> = {
      kind,
      timestamp,
    };

    entries.push(entry);
  }

  return entries;
};

const parseTpEntries = (values: { [key: string]: unknown }[]) => {
  for (const value of values) {
    try {
      parseTpEntry(value);
    } catch (e) {
      logger.error(e, value);
      return;
    }
  }
};

for (const event of data.events) {
  if (!event.entries) continue;

  parseTpEntries(event.entries);
}

// console.table(entries);
// console.log(new Set(entries.map((r) => r.type)));
