import { subscribeToPoops } from "baby-stats-firebase/poops";
import type { Poop } from "baby-stats-models/poops";
import { derived, writable } from "svelte/store";
import { user } from "./user";

export const poopsLoaded = writable(false);

export const poops = derived<typeof user, Poop[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = subscribeToPoops($user.uid, set);

  poopsLoaded.set(true);

  return unsubscribe;
});
