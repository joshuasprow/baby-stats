import type { Entry, EntryAdd } from "@baby-stats/models/entries";
import type { ZodError, ZodType } from "zod";

const parseEntry = <E extends Entry | EntryAdd>(
  type: ZodType<E>,
  entry: E,
): [E, null] | [null, ZodError<E>] => {
  try {
    return [type.parse(entry), null];
  } catch (error) {
    return [null, error as ZodError<E>];
  }
};

export const mergeEntryFields = <E extends Entry | EntryAdd>(
  type: ZodType<E>,
  entry: E,
  fields: Partial<E>,
): [E, null] | [null, ZodError<E>] => parseEntry(type, { ...entry, ...fields });
