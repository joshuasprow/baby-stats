import { z } from "zod";

export const LogLevel = z.enum(["debug", "info", "warn", "error"]);
export type LogLevel = z.infer<typeof LogLevel>;

const LogBase = z.object({
  babyId: z.string().uuid().nullable(),
  error: z.null(),
  message: z.string(),
  timestamp: z.number(),
  userId: z.string().uuid().nullable(),
});

const LogDebug = LogBase.extend({
  level: z.literal(LogLevel.Enum.debug),
});

const LogInfo = LogBase.extend({
  level: z.literal(LogLevel.Enum.info),
});

const LogWarn = LogBase.extend({
  level: z.literal(LogLevel.Enum.warn),
});

const LogError = LogBase.extend({
  level: z.literal(LogLevel.Enum.error),
  error: z.object({
    message: z.string(),
    name: z.string(),
    stack: z.string(),
  }),
});

export const Log = z.discriminatedUnion("level", [
  LogDebug,
  LogInfo,
  LogWarn,
  LogError,
]);
export type Log = z.infer<typeof Log>;
