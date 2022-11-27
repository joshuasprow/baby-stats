import { Log, LogLevel, type LogAdd } from "@baby-stats/models/logs";
import { get } from "svelte/store";
import Queue from "../lib/queue";
import { baby } from "../stores/baby";
import { user } from "../stores/user";

const PENDING_LOGS = new Queue<void>();

const buildEntry = <L extends LogLevel>(
  level: L,
  message: L extends "error" ? Error : string,
): LogAdd => {
  const $baby = get(baby);
  const $user = get(user);

  const timestamp = Date.now();

  const error: LogAdd["error"] =
    message instanceof Error
      ? {
          name: message.name,
          message: message.message,
          stack: message.stack,
        }
      : undefined;

  return {
    babyId: $baby?.id,
    error,
    level,
    message: message instanceof Error ? message.message : message,
    timestamp,
    userId: $user?.uid,
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
  (message: L extends "error" ? Error : string) => {
    console[level](message);

    try {
      const entry = buildEntry(level, message);

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
