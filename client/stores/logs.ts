import type { Log } from "@baby-stats/models/logs";
import { derived } from "svelte/store";
import { db } from "../firebase";
import logger from "../firebase/logger";
import { subscribeToLogs } from "../firebase/logs";
import { parseError } from "../lib/error";
import { user } from "./user";

export const logs = derived<typeof user, Log[]>(
  user,
  ($user, set) => {
    let unsubscribe = () => {};

    if (!$user) {
      set([]);
      return;
    }

    try {
      unsubscribe = subscribeToLogs(db, set);
    } catch (e) {
      logger.error(parseError(e));

      unsubscribe = () => {};
    }

    return unsubscribe;
  },
  [],
);
