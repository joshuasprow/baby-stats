import { z } from "zod";

export const KINDS = ["feeds", "naps", "pees", "poops"] as const;

export const KindEnum = z.enum(KINDS);
export type Kind = typeof KINDS[number];
