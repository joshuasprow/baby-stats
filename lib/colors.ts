// Thanks! https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hex-to-hsl
export const hexToHsl = (hex: string) => {
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

  return "hsl(" + h + "," + s + "%," + l + "%)";
};

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Having obtained RGB, convert channels to hex
  let R = Math.round((r + m) * 255).toString(16);
  let G = Math.round((g + m) * 255).toString(16);
  let B = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (R.length == 1) R = `0${r}`;
  if (G.length == 1) G = `0${g}`;
  if (B.length == 1) B = `0${b}`;

  return "#" + r + g + b;
};

export const getColorVariableValue = (variable: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    variable
  );

  const value = raw.trim().replaceAll("#", "");

  if (value.length === 6) return `#${value}`;

  const [r, g, b] = value;

  return `#${r}${r}${g}${g}${b}${b}`;
};
