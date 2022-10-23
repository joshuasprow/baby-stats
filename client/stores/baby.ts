import { subscribeToBaby } from "baby-stats-firebase/babies";
import type { Baby } from "baby-stats-models/babies";
import { derived } from "svelte/store";
import { db } from "../firebase";
import { user } from "./user";

export const baby = derived<typeof user, Baby | null>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set(null);
    return;
  }

  unsubscribe = subscribeToBaby(db, "U4gSGbrbKprij8G6tHB0", set);

  return unsubscribe;
});
