import type { Theme } from "@baby-stats/models/theme";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { subscribeToThemes } from "../firebase/themes";
import { handleGlobalError } from "./error";
import { user } from "./user";

export const themesLoaded = writable(false);

export const themes = derived<typeof user, Theme[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  try {
    unsubscribe = subscribeToThemes(db, $user.uid, set);
  } catch (e) {
    handleGlobalError(e, "SubscribeToThemesError");
    unsubscribe = () => {};
  }

  themesLoaded.set(true);

  return unsubscribe;
});
