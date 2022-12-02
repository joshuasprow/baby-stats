import { parseError } from "@baby-stats/lib/error";
import type { Baby } from "@baby-stats/models/babies";
import { derived } from "svelte/store";
import { setGlobalError } from "../components/GlobalError.svelte";
import { db } from "../firebase";
import { subscribeToBaby } from "../firebase/babies";
import logger from "../lib/logger";
import { user } from "./user";

export const baby = derived<typeof user, Baby | undefined | null>(
  user,
  ($user, set) => {
    let unsubscribe = () => {};

    if ($user === undefined || $user === null) {
      set($user);
      return;
    }

    try {
      unsubscribe = subscribeToBaby(db, "U4gSGbrbKprij8G6tHB0", set);
    } catch (e) {
      const error = parseError(e, "SubscribeToBabyError");
      logger.error(error);
      setGlobalError(error);

      unsubscribe = () => {};
    }

    return unsubscribe;
  },
);
