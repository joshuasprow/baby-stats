import { LogAdd } from "@baby-stats/models/logs";
import { Response } from "firebase-functions/v1";
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

const validateLogEntry = (res: Response, body: unknown): LogAdd | null => {
  try {
    const entry = LogAdd.parse(body);

    return entry;
  } catch (e) {
    const error = parseError(e, "ParseError");

    if (error instanceof ZodError) {
      const formatted = formatZodError(error);

      logger.error(formatted, { body });

      res.status(400).send(formatted);

      return null;
    }

    logger.error(error.message, {
      body,
      error: { name: error.name, stack: error.stack },
    });

    res.status(500).send("Internal Server Error");

    return null;
  }
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

    const entry = validateLogEntry(response, request.body);

    if (!entry) return;

    const { message, ...rest } = entry;

    logger.info(message, rest);

    response.send("Hello from Firebase!");
  }
);
