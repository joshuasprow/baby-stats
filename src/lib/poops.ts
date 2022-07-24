import { writable } from "svelte/store";

export interface Poop {
  timestamp: Date;
}

export const poops = writable<Poop[]>([]);

export const addPoop = () =>
  poops.update(($poops) => [...$poops, { timestamp: new Date() }]);

export const removePoop = (timestamp: Date) =>
  poops.update(($poops) => $poops.filter((nap) => nap.timestamp !== timestamp));
