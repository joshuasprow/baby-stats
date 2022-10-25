import { BLACK, getContrastRatio, WHITE } from "$lib/theme";
import {
  DEFAULT_THEME,
  HslColor,
  Theme,
  ThemeElement,
} from "@baby-stats/models/theme";
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

const setHslColor = (element: ThemeElement, hsl: HslColor | null) => {
  if (!hsl) return;

  const { hue, saturation, lightness } = hsl;

  const black = getContrastRatio(hsl, BLACK);
  const white = getContrastRatio(hsl, WHITE);

  const font = black > white ? `hsl(0, 100%, 100%)` : `hsl(0, 0%, 0%)`;

  setCssVariable(`--${element}-color-hue`, `${hue}`);
  setCssVariable(`--${element}-color-saturation`, `${saturation}%`);
  setCssVariable(`--${element}-color-lightness`, `${lightness}%`);
  setCssVariable(`--${element}-font-color`, font);
};

export const theme = writable<Theme>(DEFAULT_THEME);

const setCssTheme = (value: Theme) => {
  for (const element of Object.keys(ThemeElement.Values) as ThemeElement[]) {
    const hsl = value[element];

    setHslColor(element, hsl);
  }
};

export const setTheme = (value: Theme) => {
  theme.set({ ...value });

  setCssTheme(value);
};
