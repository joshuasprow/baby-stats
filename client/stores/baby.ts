import { db } from "$firebase/app";
import { subscribeToBaby } from "$firebase/babies";
import type { Baby } from "$models/babies";
import { derived } from "svelte/store";
import { user } from "./user";

export const baby = derived<typeof user, Baby | undefined | null>(
  user,
  ($user, set) => {
    let unsubscribe = () => {};

    if ($user === undefined || $user === null) {
      set($user);
      return;
    }

    unsubscribe = subscribeToBaby(db, "U4gSGbrbKprij8G6tHB0", set);

    return unsubscribe;
  },
);
