import { subscribeToPees } from "baby-stats-firebase/pees";
import type { Pee } from "models/pees";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
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
