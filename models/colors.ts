import { z } from "zod";

export const HexColor = z.string().startsWith("#").length(7);
export type HexColor = z.infer<typeof HexColor>;

export const HslColor = z.object({
  hue: z.number().min(0).max(255),
  saturation: z.number().min(0).max(100),
  lightness: z.number().min(0).max(100),
});
export type HslColor = z.infer<typeof HslColor>;
