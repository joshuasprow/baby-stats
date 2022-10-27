import { z } from "zod";

export const Paths = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
});
export type Paths = z.infer<typeof Paths>;

export type Result<D extends any> = [D, null] | [null, Error];
