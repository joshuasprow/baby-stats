import { addEntry, removeEntry, updateEntry } from "./days";
import { newTimestampWithPickerDate } from "./picker-date";

const PEE_AMOUNTS = [1, 2, 3] as const;

export type PeeAmount = typeof PEE_AMOUNTS[number];

export interface Pee {
  timestamp: Date;
  amount: PeeAmount;
}

type PeeAdd = Omit<Pee, "timestamp">;

export const isPee = (value: unknown): value is Pee => {
  if (typeof value !== "object" || value === null) return false;
  if (!((value as Pee).timestamp instanceof Date)) return false;
  if (typeof (value as Pee).amount !== "number") return false;
  return true;
};

export const addPee = (peeAdd: PeeAdd) => {
  const pee = { ...peeAdd, timestamp: newTimestampWithPickerDate() };
  if (!isPee(pee)) throw new Error("Invalid pee");
  addEntry("pees", pee);
};

export const updatePee = (pee: Pee) => {
  if (!isPee(pee)) throw new Error("Invalid pee");
  updateEntry("pees", pee);
};

export const removePee = (timestamp: Date) => removeEntry("pees", timestamp);
