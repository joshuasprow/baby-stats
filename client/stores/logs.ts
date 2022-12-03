import { parseError } from "@baby-stats/lib/error";
import type { Log } from "@baby-stats/models/logs";
import { derived } from "svelte/store";
import { db } from "../firebase";
import { subscribeToLogs } from "../firebase/logs";
import logger from "../lib/logger";
import globalError, { handleGlobalError } from "./error";
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
      handleGlobalError(e, "SubscribeToLogsError");
      unsubscribe = () => {};
    }

    return unsubscribe;
  },
  [],
);
