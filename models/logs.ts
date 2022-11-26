import { z } from "zod";
import { Baby } from "./babies";
import { User } from "./users";

export const LogLevel = z.enum(["debug", "info", "warn", "error"]);
export type LogLevel = z.infer<typeof LogLevel>;

export const LogError = z.object({
  message: z.string(),
  name: z.string(),
  stack: z.string().nullable(),
});
export type LogError = z.infer<typeof LogError>;

export const Log = z.object({
  id: z.string(),
  babyId: Baby.shape.id.nullable(),
  error: LogError.nullable(),
  level: LogLevel,
  message: z.string(),
  timestamp: z.number(),
  userId: User.shape.uid.nullable(),
});
export type Log = z.infer<typeof Log>;

export const LogAdd = Log.omit({ id: true });
export type LogAdd = z.infer<typeof LogAdd>;
