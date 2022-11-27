import { LogAdd } from "@baby-stats/models/logs";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { ZodError } from "zod";

const parseError = (error: unknown, nameIfUnknown = "Unknown"): Error => {
  if (!error) return new Error("Empty error");

  if (error instanceof Error) return error;

  if (typeof error === "string") return new Error(error);

  const unknown = new Error(`${nameIfUnknown}: ${JSON.stringify(error)}`);
  unknown.name = nameIfUnknown;

  return unknown;
};

const formatZodError = (error: ZodError): string => {
  const errors = Object.entries(error.flatten().fieldErrors);
  const formatted = errors.reduce((acc, [key, value]) => {
    const message = `${key}=${value?.join(", ")}`;

    return acc ? [acc, message].join("; ") : message;
  }, "");

  return `Invalid Log Entry Fields: ${formatted}`;
};

export const logs = onRequest(
  {
    cors: [
      "http://localhost",
      "https://genevieve.sprow.info",
      "https://baby-stats-10331--staging-k5ozmhec.web.app",
      "https://baby-stats-10331.firebaseapp.com",
      "https://baby-stats-10331.web.app",
    ],
    timeoutSeconds: 5,
  },
  (request, response) => {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const { body } = request;
    let entry: LogAdd;

    try {
      entry = LogAdd.parse(body);
    } catch (e) {
      const error = parseError(e, "ParseError");

      if (error instanceof ZodError) {
        const formatted = formatZodError(error);

        logger.error(formatted, { body });

        response.status(400).send(formatted);

        return;
      }

      logger.error(error.message, {
        body,
        error: { name: error.name, stack: error.stack },
      });

      response.status(500).send("Internal Server Error");

      return;
    }

    const { message, ...rest } = entry;

    logger.info(message, rest);

    response.send("Hello from Firebase!");
  }
);
