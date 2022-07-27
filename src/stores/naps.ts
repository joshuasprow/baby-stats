import { addEntry, removeEntry, updateEntry } from "./days";
import { newTimestampWithPickerDate } from "./picker-date";

export interface Nap {
  amount: number;
  timestamp: Date;
}

type NapAdd = Omit<Nap, "timestamp">;

export const isNap = (value: unknown): value is Nap => {
  if (typeof value !== "object" || value === null) return false;
  if (!((value as Nap).timestamp instanceof Date)) return false;
  if (typeof (value as Nap).amount !== "number") return false;
  return true;
};

export const addNap = (napAdd: NapAdd) => {
  const nap = { ...napAdd, timestamp: newTimestampWithPickerDate() };
  if (!isNap(nap)) throw new Error("Invalid nap");
  addEntry("naps", nap);
};

export const updateNap = (nap: Nap) => {
  if (!isNap(nap)) throw new Error("Invalid nap");
  updateEntry("naps", nap);
};

export const removeNap = (timestamp: Date) => removeEntry("naps", timestamp);
