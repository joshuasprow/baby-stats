import { parseError } from "@baby-stats/lib/error";
import { writable } from "svelte/store";
import logger from "../lib/logger";

const error = writable<Error | null>(null);

export const handleGlobalError = (
  e: unknown,
  name: `${string}Error`,
  callback?: (error: Error) => void,
) => {
  const _error = parseError(e, name);

  error.set(_error);
  logger.error(_error);

  if (callback) callback(_error);

  return _error;
};

window.onunhandledrejection = (event) => {
  console.group("Unhandled Rejection");
  console.dir(event);
  handleGlobalError(event.reason, "UnhandledRejectionError");

  console.groupEnd();
};

export default error;
