import { writable } from "svelte/store";

export interface Nap {
  timestamp: Date;
}

export const naps = writable<Nap[]>([]);

export const addNap = () =>
  naps.update(($naps) => [...$naps, { timestamp: new Date() }]);

export const removeNap = (timestamp: Date) =>
  naps.update(($naps) => $naps.filter((nap) => nap.timestamp !== timestamp));
