import { subscribeToPees } from "baby-stats-firebase/pees";
import type { Pee } from "baby-stats-models/pees";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { user } from "./user";

export const peesLoaded = writable(false);

export const pees = derived<typeof user, Pee[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToPees(db, $user.uid, set);

  peesLoaded.set(true);

  return unsubscribe;
});
