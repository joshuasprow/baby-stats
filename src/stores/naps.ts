import { addEntry, removeEntry, updateEntry } from "./days";
import { newTimestampWithPickerDate } from "./picker-date";
import { z } from "zod";

const Nap = z.object({
  timestamp: z.date(),
  amount: z.number().int().positive(),
});
export type Nap = z.infer<typeof Nap>;

export const addNap = (value: object) => {
  const nap = Nap.parse({ ...value, timestamp: newTimestampWithPickerDate() });

  addEntry("naps", nap);
};

export const updateNap = (value: object) => {
  const nap = Nap.parse(value);

  updateEntry("naps", nap);
};

export const removeNap = (timestamp: Date) => removeEntry("naps", timestamp);
