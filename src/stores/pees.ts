import { addEntry, removeEntry, updateEntry } from "./days";
import { newTimestampWithPickerDate } from "./picker-date";

export interface Pee {
  timestamp: Date;
  amount: number;
}

type PeeAdd = Omit<Pee, "timestamp">;

export const isPee = (value: unknown): value is Pee => {
  if (typeof value !== "object" || value === null) return false;
  if (!((value as Pee).timestamp instanceof Date)) return false;
  if (typeof (value as Pee).amount !== "number") return false;
  return true;
};

export const addPee = (pee: PeeAdd) => {
  if (!isPee(pee)) throw new Error("Invalid pee");
  addEntry("pees", { ...pee, timestamp: newTimestampWithPickerDate() });
};

export const updatePee = (pee: Pee) => updateEntry("pees", pee);

export const removePee = (timestamp: Date) => removeEntry("pees", timestamp);
