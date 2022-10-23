import { HexColor, HslColor, RgbColor, ThemeElement } from "$models/theme";
import { getCssVariable, setCssVariable } from "./css";

export const BLACK: HslColor = {
  hue: 0,
  saturation: 0,
  lightness: 0,
};

export const WHITE: HslColor = {
  hue: 0,
  saturation: 100,
  lightness: 100,
};

export const getHslColor = (colorType: ThemeElement) => {
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

export const getHslColors = (...colorTypes: ThemeElement[]) =>
  colorTypes.map((colorType) => {
    const color = getHslColor(colorType);

    if (!color) {
      console.warn(`missing ${colorType} color variable`);
    }

    return color || BLACK;
  });

export const setHslColor = (colorType: ThemeElement, hsl: HslColor | null) => {
  if (!hsl) return;

  const { hue, saturation, lightness } = hsl;

  setCssVariable(`--${colorType}-color-hue`, `${hue}`);
  setCssVariable(`--${colorType}-color-saturation`, `${saturation}%`);
  setCssVariable(`--${colorType}-color-lightness`, `${lightness}%`);
};

// Thanks! https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hex-to-hsl
export const hexToHsl = (hex: string): HslColor => {
  // convert hex to RGB first
  let r = 0;
  let g = 0;
  let b = 0;

  // convert to hexadecimal "string" like 0xff
  if (hex.length == 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length == 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { hue: h, saturation: s, lightness: l };
};

export const hslToHex = ({
  hue,
  saturation,
  lightness,
}: {
  hue: number;
  saturation: number;
  lightness: number;
}): HexColor => {
  saturation /= 100;
  lightness /= 100;

  let c = (1 - Math.abs(2 * lightness - 1)) * saturation,
    x = c * (1 - Math.abs(((hue / 60) % 2) - 1)),
    m = lightness - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= hue && hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= hue && hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= hue && hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= hue && hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= hue && hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= hue && hue < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Having obtained RGB, convert channels to hex
  let R = Math.round((r + m) * 255).toString(16);
  let G = Math.round((g + m) * 255).toString(16);
  let B = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (R.length == 1) R = `0${R}`;
  if (G.length == 1) G = `0${G}`;
  if (B.length == 1) B = `0${B}`;

  return "#" + R + G + B;
};

// Thanks! https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o

const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) return null;

  const rgb = RgbColor.parse({
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16),
  });

  return rgb;
};

const getLuminance = ({ red, green, blue }: RgbColor) => {
  const a = [red, green, blue].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (hslA: HslColor, hslB: HslColor) => {
  const hexA = hslToHex(hslA);
  const rgbA = hexToRgb(hexA);

  const hexB = hslToHex(hslB);
  const rgbB = hexToRgb(hexB);

  if (!rgbA) throw new Error(`Invalid color A: ${hexA}`);
  if (!rgbB) throw new Error(`Invalid color B: ${hexB}`);

  const lumA = getLuminance(rgbA);
  const lumB = getLuminance(rgbB);

  return lumA > lumB
    ? (lumB + 0.05) / (lumA + 0.05)
    : (lumA + 0.05) / (lumB + 0.05);
};
