import { addEntry, removeEntry, updateEntry } from "./days";
import { newTimestampWithPickerDate } from "./picker-date";

const POOP_AMOUNTS = [1, 2, 3] as const;

export type PoopAmount = typeof POOP_AMOUNTS[number];

export interface Poop {
  timestamp: Date;
  amount: PoopAmount;
}

type PoopAdd = Omit<Poop, "timestamp">;

export const isPoop = (value: unknown): value is Poop => {
  if (typeof value !== "object" || value === null) return false;
  if (!((value as Poop).timestamp instanceof Date)) return false;
  if (typeof (value as Poop).amount !== "number") return false;
  return true;
};

export const addPoop = (poopAdd: PoopAdd) => {
  const poop = { ...poopAdd, timestamp: newTimestampWithPickerDate() };
  if (!isPoop(poop)) throw new Error("Invalid poop");
  addEntry("poops", poop);
};

export const updatePoop = (poop: Poop) => {
  if (!isPoop(poop)) throw new Error("Invalid poop");
  updateEntry("poops", poop);
};

export const removePoop = (timestamp: Date) => removeEntry("poops", timestamp);
