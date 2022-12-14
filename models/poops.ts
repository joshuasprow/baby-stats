import { z } from "zod";
import { EntryBase } from "./entries";

export const PoopAmount = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PoopAmount = z.infer<typeof PoopAmount>;

const PoopBase = EntryBase.extend({ kind: z.literal("poops") });

export const Poop = PoopBase.extend({ amount: PoopAmount });
export type Poop = z.infer<typeof Poop>;

export const PoopAdd = Poop.omit({ id: true });
export type PoopAdd = z.infer<typeof PoopAdd>;
