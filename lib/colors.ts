import type { HexColor, HslColor } from "baby-stats-models/colors";

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
