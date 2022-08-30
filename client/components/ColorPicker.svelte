<script context="module" lang="ts">
  type ColorType = "border" | "button";

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
    const [h, s, l] = [
      `--${colorType}-color-hue`,
      `--${colorType}-color-saturation`,
      `--${colorType}-color-lightness`,
    ].map(getCssVariable);

    if (!h || !s || !l) {
      console.warn(
        `missing ${colorType} color variables: h=${h}, s=${s}, l=${l}`
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
</script>

<script lang="ts">
  import { hexToHsl, hslToHex, type HslColor } from "baby-stats-lib/colors";
  import type { ChangeEvent } from "baby-stats-lib/dom";

  export let id = "";
  export let colorType: ColorType;

  $: color = getHslColor(colorType);
  $: colorHex = color ? hslToHex(color) : undefined;

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    color = hexToHsl(hex);

    setHslColor(colorType, color);

    if (colorType !== "button") return;

    setCssVariable(
      "--button-font-color",
      color.lightness > 60 ? "black" : "white"
    );
  };
</script>

<label for={id}>
  {colorType}
  <input on:input={handleColorChange} {id} type="color" value={colorHex} />
</label>

<style>
  label {
    display: block;
  }
</style>
