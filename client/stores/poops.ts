import { db } from "$firebase";
import { subscribeToPoops } from "@baby-stats/firebase/poops";
import type { Poop } from "@baby-stats/models/poops";
import { derived, writable } from "svelte/store";
import { baby } from "./baby";

export const poopsLoaded = writable(false);

export const poops = derived<typeof baby, Poop[] | null>(baby, ($baby, set) => {
  let unsubscribe = () => {};

  if (!$baby) {
    set(null);
    return unsubscribe;
  }

  unsubscribe = subscribeToPoops(db, $baby.id, set);

  poopsLoaded.set(true);

  return unsubscribe;
});
