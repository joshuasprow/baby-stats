import type { Feed, FeedAdd } from "baby-stats-models/feeds";
import type { Nap, NapAdd } from "baby-stats-models/naps";
import type { Pee, PeeAdd } from "baby-stats-models/pees";
import type { Poop, PoopAdd } from "baby-stats-models/poops";
import type { ZodError, ZodType } from "zod";

type _Entry = Feed | FeedAdd | Nap | NapAdd | Pee | PeeAdd | Poop | PoopAdd;

export const parseEntry = <E extends _Entry>(
  type: ZodType<E>,
  feed: E
): [E, null] | [null, ZodError<E>] => {
  try {
    return [type.parse(feed), null];
  } catch (error) {
    return [null, error as ZodError<E>];
  }
};

export const addEntryFields = <E extends _Entry>(
  type: ZodType<E>,
  entry: E,
  fields: Partial<E>
) => parseEntry(type, { ...entry, ...fields });
