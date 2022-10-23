import { db } from "$firebase/app";
import { subscribeToPoops } from "$firebase/poops";
import type { Poop } from "$models/poops";
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
