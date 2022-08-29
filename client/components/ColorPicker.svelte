<script context="module" lang="ts">
  type ColorType = "border" | "button";
  type HslKey =
    | `--${ColorType}--color-hue`
    | `--${ColorType}--color-saturation`
    | `--${ColorType}--color-lightness`;

  const getCssVariable = (variable: string) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      variable
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
    const [hue, saturation, lightness] = [
      `--${colorType}-color-hue`,
      `--${colorType}-color-saturation`,
      `--${colorType}-color-lightness`,
    ].map(getCssVariable);

    if (!hue || !saturation || !lightness) {
      console.warn(
        `missing ${colorType} color variables: h=${hue}, s=${saturation}, l=${lightness}`
      );
      return null;
    }

    return {
      hue: parseInt(hue, 10),
      saturation: parseInt(saturation, 10),
      lightness: parseInt(lightness, 10),
    };
  };

  const setHslColor = (colorType: ColorType, hsl: HslColor | null) => {
    if (!hsl) return;

    const { hue, saturation, lightness } = hsl;

    setCssVariable(`--${colorType}-color-hue`, `${hue}`);
    setCssVariable(`--${colorType}-color-saturation`, `${saturation}%`);
    setCssVariable(`--${colorType}-color-lightness`, `${lightness}%`);
  };
</script>

<script lang="ts">
  import { hexToHsl, hslToHex, type HslColor } from "baby-stats-lib/colors";
  import type { ChangeEvent } from "baby-stats-lib/dom";

  export let colorType: ColorType;

  $: color = getHslColor(colorType);
  $: colorHex = color ? hslToHex(color) : undefined;

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    color = hexToHsl(hex);

    setHslColor(colorType, color);
  };
</script>

<input on:input={handleColorChange} type="color" value={colorHex} />
