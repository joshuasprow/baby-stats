import { subscribeToNaps } from "baby-stats-firebase/naps";
import type { Nap } from "baby-stats-models/naps";
import { derived, writable } from "svelte/store";
import { user } from "./user";

export const napsLoaded = writable(false);

export const naps = derived<typeof user, Nap[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToNaps($user.uid, set);

  napsLoaded.set(true);

  return unsubscribe;
});
