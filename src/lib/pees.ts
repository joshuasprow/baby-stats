import { addEntry, removeEntry } from "./days";

export interface Pee {
  timestamp: Date;
}

export const addPee = (pee: Pee) => addEntry("pees", pee);

export const removePee = (timestamp: Date) => removeEntry("pees", timestamp);
