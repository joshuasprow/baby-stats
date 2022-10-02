import { z } from "zod";

export const HexColor = z.string().startsWith("#").length(7);
export type HexColor = z.infer<typeof HexColor>;

export const HslColor = z.object({
  hue: z.number().min(0).max(255),
  saturation: z.number().min(0).max(100),
  lightness: z.number().min(0).max(100),
});
export type HslColor = z.infer<typeof HslColor>;

export const RgbColor = z.object({
  red: z.number().min(0).max(255),
  green: z.number().min(0).max(255),
  blue: z.number().min(0).max(255),
});
export type RgbColor = z.infer<typeof RgbColor>;

export const ThemeElement = z.enum(["background", "border", "button"]);
export type ThemeElement = z.infer<typeof ThemeElement>;

export const Theme = z.object({
  id: z.string().min(1).nullable(),
  name: z.string().min(1),
  background: HslColor,
  border: HslColor,
  button: HslColor,
});
export type Theme = z.infer<typeof Theme>;

export const DEFAULT_THEME: Theme = {
  id: null,
  name: "Default",
  background: { hue: 0, saturation: 0, lightness: 100 },
  border: { hue: 0, saturation: 0, lightness: 53 },
  button: { hue: 0, saturation: 0, lightness: 100 },
};
