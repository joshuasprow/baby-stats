import { z } from "zod";

export const LogLevel = z.enum(["debug", "info", "warn", "error"]);
export type LogLevel = z.infer<typeof LogLevel>;

export const LogError = z.object({
  message: z.string(),
  name: z.string(),
  stack: z.string().nullable(),
});
export type LogError = z.infer<typeof LogError>;

export const Log = z.object({
  babyId: z.string().uuid().nullable(),
  error: LogError.nullable(),
  level: LogLevel,
  message: z.string(),
  timestamp: z.number(),
  userId: z.string().uuid().nullable(),
});
export type Log = z.infer<typeof Log>;
