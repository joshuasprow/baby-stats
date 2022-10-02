import { z } from "zod";

export const Baby = z.object({ parents: z.array(z.string().min(1)) });
export type Baby = z.infer<typeof Baby>;
