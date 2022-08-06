import { z } from "zod";
import { Feed } from "./feeds";
import { Nap } from "./naps";
import { Pee } from "./pees";
import { Poop } from "./poops";

export const Snapshot = z.object({
  id: z.string(),
  createdAt: z.date(),
  uid: z.string(),
  feeds: z.array(Feed),
  naps: z.array(Nap),
  pees: z.array(Pee),
  poops: z.array(Poop),
});
export type Snapshot = z.infer<typeof Snapshot>;
