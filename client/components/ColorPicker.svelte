<script context="module" lang="ts">
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

  const getBorderColor = () => {
    const [hue, saturation, lightness] = [
      "--border-color-hue",
      "--border-color-saturation",
      "--border-color-lightness",
    ].map(getCssVariable);

    if (!hue || !saturation || !lightness) {
      console.warn(
        `missing border color variables: ${hue}, ${saturation}, ${lightness}`
      );
      return null;
    }

    return {
      hue: parseInt(hue, 10),
      saturation: parseInt(saturation, 10),
      lightness: parseInt(lightness, 10),
    };
  };

  const setBorderColor = (hsl: HslColor | null) => {
    if (!hsl) return;

    const { hue, saturation, lightness } = hsl;

    setCssVariable("--border-color-hue", `${hue}`);
    setCssVariable("--border-color-saturation", `${saturation}%`);
    setCssVariable("--border-color-lightness", `${lightness}%`);
  };
</script>

<script lang="ts">
  import { hexToHsl, hslToHex, type HslColor } from "baby-stats-lib/colors";
  import type { ChangeEvent } from "baby-stats-lib/dom";

  let borderColor = getBorderColor();

  $: borderColorHex = borderColor ? hslToHex(borderColor) : undefined;

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    borderColor = hexToHsl(hex);

    setBorderColor(borderColor);
  };
</script>

<input on:input={handleColorChange} type="color" value={borderColorHex} />
