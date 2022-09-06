import {
  DEFAULT_THEME,
  HslColor,
  Theme,
  ThemeAdd,
  ThemeElement,
} from "baby-stats-models/theme";
import { writable } from "svelte/store";

const getCssVariable = (variable: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    variable,
  );

  if (!value) return null;

  return value;
};

const setCssVariable = (variable: string, value: string) => {
  if (!variable.startsWith("--")) {
    console.warn(`invalid color variable: ${variable}`);
    return;
  }

  document.documentElement.style.setProperty(variable, value);
};

const getHslColor = (themeElement: ThemeElement) => {
  const [h, s, l] = [
    `--${themeElement}-color-hue`,
    `--${themeElement}-color-saturation`,
    `--${themeElement}-color-lightness`,
  ].map(getCssVariable);

  if (!h || !s || !l) return null;

  return {
    hue: parseInt(h, 10),
    saturation: parseInt(s, 10),
    lightness: parseInt(l, 10),
  };
};

const setHslColor = (colorType: ThemeElement, hsl: HslColor | null) => {
  if (!hsl) return;

  const { hue, saturation, lightness } = hsl;

  setCssVariable(`--${colorType}-color-hue`, `${hue}`);
  setCssVariable(`--${colorType}-color-saturation`, `${saturation}%`);
  setCssVariable(`--${colorType}-color-lightness`, `${lightness}%`);
};

export const theme = writable<Theme | ThemeAdd>(DEFAULT_THEME);

export const setTheme = (value: ThemeAdd) => {
  theme.set(value);

  for (const element of Object.keys(value) as ThemeElement[]) {
    const hsl = getHslColor(element);

    if (hsl) setHslColor(element, hsl);
  }
};
