import { EntryAdd } from "@baby-stats/models/entries";
import { EntryKind, EntryKindEnum } from "@baby-stats/models/entries-base";
import { FeedAdd } from "@baby-stats/models/feeds";
import { MedAdd } from "@baby-stats/models/meds";
import { NapAdd } from "@baby-stats/models/naps";
import { PeeAdd } from "@baby-stats/models/pees";
import { PoopAdd } from "@baby-stats/models/poops";
import { Entry as TpEntry } from "@baby-stats/models/tadpoles";
import { Timestamp } from "@firebase/firestore";
import { parseError } from "./error";
import data from "./tmp/tadpoles-data.json" assert { type: "json" };

const KINDS = EntryKindEnum.Enum;
const BABY_ID = "baby-1";
const USER_ID = "user-1";

const logger = {
  warn: (message: string) => console.warn(`\x1b[33mWarning:\x1b[0m ${message}`),
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
    return [KINDS.pees, KINDS.poops];
  }

  if (isPee) return [KINDS.pees];
  if (isPoop) return [KINDS.poops];

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
      return [KINDS.naps];
    case "food":
      return [KINDS.feeds];
    case "medication":
      return [KINDS.meds];
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

const buildFeedEntry = (
  { id, quantity }: Pick<TpEntry, "id" | "quantity">,
  timestamp: Timestamp
): FeedAdd | null => {
  if (!quantity || typeof quantity !== "number") {
    // logger.warn(`No quantity for feed entry: [${id}] ${quantity}`);
    return null;
  }

  return FeedAdd.parse({
    babyId: BABY_ID,
    userId: USER_ID,
    kind: KINDS.feeds,
    timestamp,
    source: "bottle",
    amount: quantity,
    side: null,
  });
};

const buildMedEntry = (
  {
    id,
    measure,
    name,
    quantity,
  }: Pick<TpEntry, "id" | "measure" | "name" | "quantity">,
  timestamp: Timestamp
): MedAdd | null => {
  if (!quantity || typeof quantity !== "number") {
    // logger.warn(`Invalid quantity for med entry: [${id}] ${quantity}`);
    return null;
  }

  if (!name) {
    // logger.warn(`No name for med entry: [${id}] ${name}`);
    return null;
  }

  return MedAdd.parse({
    babyId: BABY_ID,
    userId: USER_ID,
    kind: KINDS.meds,
    timestamp,
    amount: quantity,
    name: name,
    unit: measure,
  });
};

const buildNapEntry = (
  { id, start_time, end_time }: Pick<TpEntry, "id" | "start_time" | "end_time">,
  timestamp: Timestamp
): NapAdd | null => {
  if (!start_time || typeof start_time !== "number") {
    // logger.warn(`Invalid start_time for nap entry: [${id}] ${start_time}`);
    return null;
  }

  if (!end_time || typeof end_time !== "number") {
    // logger.warn(`Invalid end_time for nap entry: [${id}] ${end_time}`);
    return null;
  }

  return NapAdd.parse({
    babyId: BABY_ID,
    userId: USER_ID,
    kind: KINDS.naps,
    timestamp,
    amount: {
      start: Timestamp.fromMillis(start_time),
      end: Timestamp.fromMillis(end_time),
    },
  });
};

const buildPeeEntry = (
  { id, quantity }: Pick<TpEntry, "id" | "quantity">,
  timestamp: Timestamp
): PeeAdd | null => {
  if (!quantity || typeof quantity !== "number") {
    // logger.warn(`Invalid quantity for pee entry: [${id}] ${quantity}`);
    return null;
  }

  return PeeAdd.parse({
    babyId: BABY_ID,
    userId: USER_ID,
    kind: KINDS.pees,
    timestamp,
    amount: quantity,
  });
};

const buildPoopEntry = (
  { id, quantity }: Pick<TpEntry, "id" | "quantity">,
  timestamp: Timestamp
): PoopAdd | null => {
  if (!quantity || typeof quantity !== "number") {
    // logger.warn(`Invalid quantity for pee entry: [${id}] ${quantity}`);
    return null;
  }

  return PoopAdd.parse({
    babyId: BABY_ID,
    userId: USER_ID,
    kind: KINDS.pees,
    timestamp,
    amount: quantity,
  });
};

const buildEntry = (
  tpEntry: TpEntry,
  kind: EntryKind,
  timestamp: Timestamp
): EntryAdd | null => {
  switch (kind) {
    case KINDS.feeds:
      return buildFeedEntry(tpEntry, timestamp);
    case KINDS.meds:
      return buildMedEntry(tpEntry, timestamp);
    case KINDS.naps:
      return buildNapEntry(tpEntry, timestamp);
    case KINDS.pees:
      return buildPeeEntry(tpEntry, timestamp);
    case KINDS.poops:
      return buildPoopEntry(tpEntry, timestamp);
    default:
      return null;
  }
};

const parseTpEntry = (value: unknown) => {
  const tpEntry = TpEntry.parse(value);

  if (tpEntry.parent) return [];

  const kinds = parseTpType(tpEntry);

  if (!kinds.length) return [];

  const timestamp = parseStartTime(tpEntry);

  const entries: EntryAdd[] = [];

  for (const kind of kinds) {
    const entry = buildEntry(tpEntry, kind, timestamp);

    if (entry) entries.push(entry);
  }

  return entries;
};

const parseEventEntries = (values: { [key: string]: unknown }[]) => {
  const entries: EntryAdd[] = [];

  for (const value of values) {
    try {
      entries.push(...parseTpEntry(value));
    } catch (e) {
      logger.error(e, value);
      return [];
    }
  }

  return entries;
};

const entries: EntryAdd[] = [];

for (const event of data.events) {
  if (!event.entries) continue;

  entries.push(...parseEventEntries(event.entries));
}

console.log(`Found ${entries.length} entries`);

console.table(
  entries.filter((e) => e.kind === KINDS.pees || e.kind === KINDS.poops)
);
// console.log(new Set(entries.map((r) => r.type)));
