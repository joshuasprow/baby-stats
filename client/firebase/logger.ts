import { analytics } from ".";
import { logEvent } from "@firebase/analytics";

const logger = {
  error: (error: Error) => {
    console.error(error);

    logEvent(analytics, "exception", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  },
};

export default logger;
