import { writable } from "svelte/store";

export interface Pee {
  timestamp: Date;
}

export const pees = writable<Pee[]>([]);

export const addPee = () =>
  pees.update(($pees) => [...$pees, { timestamp: new Date() }]);

export const removePee = (timestamp: Date) =>
  pees.update(($pees) => $pees.filter((nap) => nap.timestamp !== timestamp));
