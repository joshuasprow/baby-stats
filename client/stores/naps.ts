import type { Nap } from "@baby-stats/models/naps";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { subscribeToNaps } from "../firebase/naps";
import { baby } from "./baby";

export const napsLoaded = writable(false);

export const naps = derived<typeof baby, Nap[] | null>(baby, ($baby, set) => {
  let unsubscribe = () => {};

  if (!$baby) {
    set(null);
    return unsubscribe;
  }

  unsubscribe = subscribeToNaps(db, $baby.id, set);

  napsLoaded.set(true);

  return unsubscribe;
});
