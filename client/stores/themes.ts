import { subscribeToTheme } from "baby-stats-firebase/themes";
import type { Theme } from "baby-stats-models/theme";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { user } from "./user";

export const themesLoaded = writable(false);

export const themes = derived<typeof user, Theme[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToTheme(db, $user.uid, set);

  themesLoaded.set(true);

  return unsubscribe;
});
