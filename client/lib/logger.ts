import { Log, LogLevel, type LogAdd } from "@baby-stats/models/logs";
import Queue from "./queue";

export type LogOptions = Pick<LogAdd, "babyId" | "userId">;

const PENDING_LOGS = new Queue<void>();

const buildEntry = <L extends LogLevel>(
  level: L,
  message: L extends "error" ? Error : string,
  { babyId, userId } = {} as LogOptions,
): LogAdd => {
  const timestamp = Date.now();

  const error =
    message instanceof Error
      ? {
          name: message.name,
          message: message.message,
          stack: message.stack,
        }
      : undefined;

  return {
    babyId,
    error,
    level,
    message: message instanceof Error ? message.message : message,
    timestamp,
    userId,
  };
};

const sendLogEntry = async (entry: LogAdd) => {
  try {
    const res = await fetch("https://logs-ppyf5q4eoa-uc.a.run.app", {
      method: "POST",
      body: JSON.stringify(entry),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (res.status >= 300) {
      console.error(
        `Error sending log entry [${res.status} ${
          res.statusText
        }]: ${JSON.stringify(json)}`,
      );
      return;
    }

    const { success } = Log.safeParse(json);

    if (!success) {
      console.error(`Expected response to be Log; got ${JSON.stringify(json)}`);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

const newLogFunc =
  <L extends LogLevel>(level: L) =>
  (message: L extends "error" ? Error : string, options = {} as LogOptions) => {
    console[level](message);

    try {
      const entry = buildEntry(level, message, options);

      PENDING_LOGS.enqueue(() => sendLogEntry(entry));
    } catch (error) {
      console.error(error);
    }
  };

const logger = {
  debug: newLogFunc("debug"),
  info: newLogFunc("info"),
  log: newLogFunc("info"),
  warn: newLogFunc("warn"),
  error: newLogFunc("error"),
};

export default logger;
