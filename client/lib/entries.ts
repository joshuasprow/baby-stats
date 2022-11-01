import type { Feed, FeedAdd } from "@baby-stats/models/feeds";
import type { Nap, NapAdd } from "@baby-stats/models/naps";
import type { Pee, PeeAdd } from "@baby-stats/models/pees";
import type { Poop, PoopAdd } from "@baby-stats/models/poops";
import type { ZodError, ZodType } from "zod";

type EntryType = Feed | FeedAdd | Nap | NapAdd | Pee | PeeAdd | Poop | PoopAdd;

const parseEntry = <E extends EntryType>(
  type: ZodType<E>,
  feed: E,
): [E, null] | [null, ZodError<E>] => {
  try {
    return [type.parse(feed), null];
  } catch (error) {
    return [null, error as ZodError<E>];
  }
};

export const mergeEntryFields = <E extends EntryType>(
  type: ZodType<E>,
  entry: E,
  fields: Partial<E>,
) => parseEntry(type, { ...entry, ...fields });
