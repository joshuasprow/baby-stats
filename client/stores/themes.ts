import { db } from "$firebase";
import { subscribeToThemes } from "$firebase/themes";
import type { Theme } from "$models/theme";
import { derived, writable } from "svelte/store";
import { user } from "./user";

export const themesLoaded = writable(false);

export const themes = derived<typeof user, Theme[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToThemes(db, $user.uid, set);

  themesLoaded.set(true);

  return unsubscribe;
});
