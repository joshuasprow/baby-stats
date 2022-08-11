import type { Feed, FeedAdd } from "baby-stats-models/feeds";
import type { NapAdd, NapNext } from "baby-stats-models/naps";
import type { Pee, PeeAdd } from "baby-stats-models/pees";
import type { Poop, PoopAdd } from "baby-stats-models/poops";
import { derived } from "svelte/store";
import type { ZodError, ZodType } from "zod";
import { feedsLoaded } from "./feeds";
import { napsLoaded } from "./naps";
import { peesLoaded } from "./pees";
import { poopsLoaded } from "./poops";

type _Entry = Feed | FeedAdd | NapNext | NapAdd | Pee | PeeAdd | Poop | PoopAdd;

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

export const entriesLoaded = derived(
  [feedsLoaded, napsLoaded, peesLoaded, poopsLoaded],
  ([f, n, p, po]) => f && n && p && po
);
