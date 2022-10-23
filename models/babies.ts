import { z } from "zod";

export const Baby = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  parents: z.array(z.string().min(1)),
});
export type Baby = z.infer<typeof Baby>;
