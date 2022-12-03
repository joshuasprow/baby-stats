import { parseError } from "@baby-stats/lib/error";
import { writable } from "svelte/store";
import { useRegisterSW } from "virtual:pwa-register/svelte";
import logger from "../lib/logger";
import globalError from "../stores/error";

export const swError = writable<null | Error>(null);
export const swRegistered = writable(false);

export const {
  needRefresh: swNeedRefresh,
  offlineReady: swOfflineReady,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered: () => swRegistered.set(true),
  onRegisterError: (e) => {
    const error = parseError(e, "SwRegistrationError");
    logger.error(error);
    swError.set(error);
    globalError.set(error);
  },
});
