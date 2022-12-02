import { parseError } from "@baby-stats/lib/error";
import type { Theme } from "@baby-stats/models/theme";
import { derived, writable } from "svelte/store";
import { setGlobalError } from "../components/GlobalError.svelte";
import { db } from "../firebase";
import { subscribeToThemes } from "../firebase/themes";
import logger from "../lib/logger";
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
    const error = parseError(e, "SubscribeToThemesError");
    logger.error(error);
    setGlobalError(error);

    unsubscribe = () => {};
  }

  themesLoaded.set(true);

  return unsubscribe;
});
