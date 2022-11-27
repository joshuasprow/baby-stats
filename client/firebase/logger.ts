import { LogError, LogLevel, type LogAdd } from "@baby-stats/models/logs";
import { get } from "svelte/store";
import { options } from ".";
import Queue from "../lib/queue";
import { baby } from "../stores/baby";
import { accessToken, user } from "../stores/user";

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

const getFieldValue = (value: unknown) => {
  const vundefined = () => ({});

  const vstring = (v: string | undefined) =>
    v === null ? vundefined() : { stringValue: v };

  if (value === null) return vundefined();

  if (typeof value === "string") return vstring(value);

  if (typeof value === "number") return { integerValue: value };

  if (LogError.safeParse(value).success) {
    const v = value as unknown as LogError;

    return {
      mapValue: {
        fields: {
          message: vstring(v.message),
          name: vstring(v.name),
          stack: vstring(v.stack),
        },
      },
    };
  }

  throw new Error(`Invalid value: (${typeof value}) ${JSON.stringify(value)}`);
};

const buildPayload = (entry: LogAdd) => {
  const fields: Record<string, ReturnType<typeof getFieldValue>> = {};

  for (const [key, value] of Object.entries(entry)) {
    fields[key] = getFieldValue(value);
  }

  return { fields };
};

const sendLogEntry = async (payload: ReturnType<typeof buildPayload>) => {
  const $accessToken = get(accessToken);

  if (!$accessToken) {
    console.error("No access token; cannot send log entry");
    return;
  }

  const name = `projects/${options.projectId}/databases/(default)/documents/logs`;
  const url = `https://firestore.googleapis.com/v1/${name}`;
  const headers = {
    Authorization: `Bearer ${$accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      body: JSON.stringify(payload),
      method: "POST",
      headers,
    });
    const json = await res.json();

    if (res.status >= 400) {
      console.error(
        `Error sending log entry [${res.status} ${
          res.statusText
        }]: ${JSON.stringify(json)}`,
      );
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

    const entry = buildEntry(level, message);
    const payload = buildPayload(entry);

    PENDING_LOGS.enqueue(() => sendLogEntry(payload));
  };

const logger = {
  debug: newLogFunc("debug"),
  info: newLogFunc("info"),
  log: newLogFunc("info"),
  warn: newLogFunc("warn"),
  error: newLogFunc("error"),
};

export default logger;
