import { z } from "zod";

export const HexColor = z.string().startsWith("#").length(7);
export type HexColor = z.infer<typeof HexColor>;

export const HslColor = z.object({
  hue: z.number().min(0).max(255),
  saturation: z.number().min(0).max(100),
  lightness: z.number().min(0).max(100),
});
export type HslColor = z.infer<typeof HslColor>;

export const ColorType = z.enum(["background", "border", "button"]);
export type ColorType = z.infer<typeof ColorType>;

export const Colors = z.object({
  id: z.string(),
  background: HexColor,
  border: HexColor,
  button: HexColor,
});
export type Colors = z.infer<typeof Colors>;

export const ColorsAdd = Colors.omit({ id: true });
export type ColorsAdd = z.infer<typeof ColorsAdd>;
