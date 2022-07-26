import { addEntry, removeEntry } from "../lib/entries";

export interface Poop {
  timestamp: Date;
}

export const addPoop = (poop: Poop) => addEntry("poops", poop);

export const removePoop = (timestamp: Date) => removeEntry("poops", timestamp);
