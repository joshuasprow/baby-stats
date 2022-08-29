<script context="module" lang="ts">
  type ColorType = "border" | "button" | "button-font";

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

  export let id = "";
  export let colorType: ColorType;

  $: color = getHslColor(colorType);
  $: colorHex = color ? hslToHex(color) : undefined;

  const getContrastRatio = () => {
    if (!color) {
      console.warn(`missing ${colorType} color`);
      return;
    }

    const font = getHslColor("button-font");

    if (!font) {
      console.warn(`missing font color`);
      return;
    }

    const lighter =
      font.lightness > color.lightness ? font.lightness : color.lightness;
    const darker =
      font.lightness < color.lightness ? font.lightness : color.lightness;

    console.log(`lighter: ${lighter === font.lightness ? "font" : "color"}`);

    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    console.log(`contrast ratio: ${contrastRatio}`);
  };

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    color = hexToHsl(hex);

    setHslColor(colorType, color);

    getContrastRatio();
  };
</script>

<input on:input={handleColorChange} {id} type="color" value={colorHex} />
