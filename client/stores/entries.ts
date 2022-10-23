import type { Feed, FeedAdd } from "models/feeds";
import type { Nap, NapAdd } from "models/naps";
import type { Pee, PeeAdd } from "models/pees";
import type { Poop, PoopAdd } from "models/poops";
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

export const addEntryFields = <E extends EntryType>(
  type: ZodType<E>,
  entry: E,
  fields: Partial<E>,
) => parseEntry(type, { ...entry, ...fields });
