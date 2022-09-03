import { subscribeToColors } from "baby-stats-firebase/colors";
import type { Colors } from "baby-stats-models/colors";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { user } from "./user";

export const themesLoaded = writable(false);

export const themes = derived<typeof user, Colors[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToColors(db, $user.uid, set);

  themesLoaded.set(true);

  return unsubscribe;
});
