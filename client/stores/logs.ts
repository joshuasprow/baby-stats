import type { Log } from "@baby-stats/models/logs";
import { derived } from "svelte/store";
import { db } from "../firebase";
import logger from "../lib/logger";
import { subscribeToLogs } from "../firebase/logs";
import { parseError } from "@baby-stats/lib/error";
import { user } from "./user";
import { setGlobalError } from "../components/GlobalError.svelte";

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
      const error = parseError(e, "SubscribeToLogsError");
      logger.error(error);
      setGlobalError(error);

      unsubscribe = () => {};
    }

    return unsubscribe;
  },
  [],
);
