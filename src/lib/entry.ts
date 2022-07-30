import { z } from "zod";

export const Entry = z.object({
  timestamp: z.date(),
  amount: z.number(),
});
export type Entry = z.infer<typeof Entry>;
