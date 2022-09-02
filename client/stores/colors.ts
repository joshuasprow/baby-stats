import { HslColor } from "baby-stats-models/colors";
import { onMount } from "svelte";
import { writable } from "svelte/store";
import { z } from "zod";

export const Colors = z.object({
  background: HslColor,
  border: HslColor,
  button: HslColor,
});
export type Colors = z.infer<typeof Colors>;

const ColorType = Colors.keyof();
export type ColorType = z.infer<typeof ColorType>;

const getCssVariable = (variable: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    variable,
  );

  if (!value) {
    console.warn(`missing color variable: ${variable}`);
    return null;
  }

  return value;
};

const setCssVariable = (variable: string, value: string) => {
  if (!variable.startsWith("--")) {
    console.warn(`invalid color variable: ${variable}`);
    return;
  }

  document.documentElement.style.setProperty(variable, value);
};

const getHslColor = (colorType: ColorType) => {
  const [h, s, l] = [
    `--${colorType}-color-hue`,
    `--${colorType}-color-saturation`,
    `--${colorType}-color-lightness`,
  ].map(getCssVariable);

  if (!h || !s || !l) {
    console.warn(
      `missing ${colorType} color variables: h=${h}, s=${s}, l=${l}`,
    );
    return null;
  }

  return {
    hue: parseInt(h, 10),
    saturation: parseInt(s, 10),
    lightness: parseInt(l, 10),
  };
};

const setHslColor = (colorType: ColorType, hsl: HslColor | null) => {
  if (!hsl) return;

  const { hue, saturation, lightness } = hsl;

  setCssVariable(`--${colorType}-color-hue`, `${hue}`);
  setCssVariable(`--${colorType}-color-saturation`, `${saturation}%`);
  setCssVariable(`--${colorType}-color-lightness`, `${lightness}%`);
};

export const colors = writable<Colors | null>(null);

onMount(() => {
  const partial: Partial<Colors> = {};

  for (const colorType of Object.keys(ColorType.Values) as ColorType[]) {
    const hsl = getHslColor(colorType);

    if (hsl) {
      partial[colorType] = hsl;

      setHslColor(colorType, hsl);
    }
  }

  try {
    if (Object.keys(partial).length === 0) {
      throw new Error("No colors found");
    }

    const _colors = Colors.parse(partial);

    colors.set(_colors);
  } catch (e) {
    console.error(e);
  }
});
