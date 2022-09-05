import { getTheme } from "baby-stats-firebase/themes";
import {
  DEFAULT_THEME,
  HslColor,
  Theme,
  ThemeAdd,
  ThemeElement,
} from "baby-stats-models/theme";
import type { User } from "baby-stats-models/users";
import { db } from "firebase";
import { onMount } from "svelte";
import { derived, get, type Readable } from "svelte/store";
import { user } from "./user";

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

const getHslColor = (themeElement: ThemeElement) => {
  const [h, s, l] = [
    `--${themeElement}-color-hue`,
    `--${themeElement}-color-saturation`,
    `--${themeElement}-color-lightness`,
  ].map(getCssVariable);

  if (!h || !s || !l) {
    console.warn(
      `missing ${themeElement} color variables: h=${h}, s=${s}, l=${l}`,
    );
    return null;
  }

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

let fetchingTheme = false;

export const theme = derived<Readable<User | null | undefined>, ThemeAdd>(
  user,
  ($user, set) => {
    let $theme = get(theme);

    if ($theme) return;

    $theme = DEFAULT_THEME;

    for (const element of Object.keys($theme) as ThemeElement[]) {
      const hsl = getHslColor(element);

      if (hsl) setHslColor(element, hsl);
    }

    set(DEFAULT_THEME);

    if (!$user || fetchingTheme) return;

    if (!$user.themeId) {
      console.warn("User is missing theme id");
      return;
    }

    getTheme(db, $user.uid, $user.themeId).then(set).catch(console.error);
  },
);

// onMount(() => {
//   const partial: Partial<Theme> = {};

//   for (const colorType of Object.keys(ThemeElement.Values) as ThemeElement[]) {
//     const hsl = getHslColor(colorType);

//     if (hsl) {
//       partial[colorType] = hsl;

//       setHslColor(colorType, hsl);
//     }
//   }

//   try {
//     if (Object.keys(partial).length === 0) {
//       throw new Error("No colors found");
//     }

//     theme.set(Theme.parse(partial));
//   } catch (e) {
//     console.error(e);
//   }
// });
