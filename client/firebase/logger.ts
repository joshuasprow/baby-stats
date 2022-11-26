import { LogError, LogLevel, type Log } from "@baby-stats/models/logs";
import { get } from "svelte/store";
import { options } from ".";
import Queue from "../lib/queue";
import { baby } from "../stores/baby";
import { accessToken, user } from "../stores/user";

const QUEUE = new Queue<Log>();

const buildEntry = <L extends LogLevel>(
  level: L,
  message: L extends "error" ? Error : string,
): Log => {
  const $baby = get(baby);
  const $user = get(user);

  const timestamp = Date.now();

  const error: Log["error"] =
    message instanceof Error
      ? {
          name: message.name,
          message: message.message,
          stack: message.stack || null,
        }
      : null;

  return {
    babyId: $baby?.id ?? null,
    error,
    level,
    message: message instanceof Error ? message.message : message,
    timestamp,
    userId: $user?.uid ?? null,
  };
};

const getFieldValue = (value: unknown) => {
  const vnull = () => ({ nullValue: null });

  const vstring = (v: string | null) =>
    v === null ? vnull() : { stringValue: v };

  if (value === null) return vnull();

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

const buildPayload = (entry: Log) => {
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

  console.log({ accessToken: $accessToken });

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

const newInfoLog = () => (message: string) => {
  console.log(message);

  const entry = buildEntry("info", message);
  const payload = buildPayload(entry);

  sendLogEntry(payload);
};

const logger = {
  debug: (message: string) => {
    console.debug(message);

    const entry = buildEntry("debug", message);
    const payload = buildPayload(entry);

    sendLogEntry(payload);
  },
  info: newInfoLog(),
  log: newInfoLog(),
  warn: (message: string) => {
    console.warn(message);

    const entry = buildEntry("warn", message);
    const payload = buildPayload(entry);

    sendLogEntry(payload);
  },
  error: (error: Error) => {
    console.error(error);

    const entry = buildEntry("error", error);
    const payload = buildPayload(entry);
  },
};

export default logger;
