export const KINDS = ["feeds", "naps", "pees", "poops"] as const;

export type Kind = typeof KINDS[number];
