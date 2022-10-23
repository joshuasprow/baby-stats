import { subscribeToNaps } from "baby-stats-firebase/naps";
import type { Nap } from "baby-stats-models/naps";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { baby } from "./baby";

export const napsLoaded = writable(false);

export const naps = derived<typeof baby, Nap[]>(baby, ($baby, set) => {
  let unsubscribe = () => {};

  if (!$baby) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToNaps(db, $baby.id, set);

  napsLoaded.set(true);

  return unsubscribe;
});
