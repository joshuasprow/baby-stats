import { addEntry, removeEntry } from "./entries";

export interface Nap {
  timestamp: Date;
}

export const addNap = (nap: Nap) => addEntry("naps", nap);

export const removeNap = (timestamp: Date) => removeEntry("naps", timestamp);
