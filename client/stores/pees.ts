import type { Pee } from "@baby-stats/models/pees";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { subscribeToPees } from "../firebase/pees";
import { baby } from "./baby";

export const peesLoaded = writable(false);

export const pees = derived<typeof baby, Pee[] | null>(baby, ($baby, set) => {
  let unsubscribe = () => {};

  if (!$baby) {
    set(null);
    return unsubscribe;
  }

  unsubscribe = subscribeToPees(db, $baby.id, set);

  peesLoaded.set(true);

  return unsubscribe;
});
