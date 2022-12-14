import { parseError } from "@baby-stats/lib/error";
import { Log, LogAdd } from "@baby-stats/models/logs";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Response } from "firebase-functions/v1";
import { logger } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { ZodError } from "zod";

const app = initializeApp();
const db = getFirestore(app);

const formatZodError = (error: ZodError): string => {
  const errors = Object.entries(error.flatten().fieldErrors);
  const formatted = errors.reduce((acc, [key, value]) => {
    const message = `${key} - ${value?.join(", ")}`;

    return acc ? [acc, message].join("; ") : message;
  }, "");

  return `Invalid Log Entry Fields: ${formatted}`;
};

const validateLogEntry = (
  res: Response,
  body: unknown
): [logAdd: LogAdd, success: true] | [logAdd: null, success: false] => {
  try {
    const logAdd = LogAdd.parse(body);

    return [logAdd, true];
  } catch (e) {
    const error = parseError(e, "ParseError");

    if (error instanceof ZodError) {
      const formatted = formatZodError(error);

      logger.error(formatted, { body });

      res.status(400).send(formatted);

      return [null, false];
    }

    logger.error(error.message, {
      body,
      error: { name: error.name, stack: error.stack },
    });

    res.status(500).send("Internal Server Error");

    return [null, false];
  }
};

const createDbEntry = async (logAdd: LogAdd): Promise<Log> => {
  const ref = db.collection("logs").doc();
  const log = Log.parse({ ...logAdd, id: ref.id });

  await ref.set(log);

  return log;
};

export const logs = onRequest(
  {
    cors: [
      "http://localhost:5173",
      "https://genevieve.sprow.info",
      "https://baby-stats-10331--staging-k5ozmhec.web.app",
      "https://baby-stats-10331.firebaseapp.com",
      "https://baby-stats-10331.web.app",
    ],
    timeoutSeconds: 5,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const [logAdd, success] = validateLogEntry(res, req.body);

    if (!success) return;

    const log = await createDbEntry(logAdd);

    logger.info("Log entry created", { entry: log });

    res.send(log);
  }
);
