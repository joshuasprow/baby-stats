<script lang="ts">
  import {
    getHslColor,
    hexToHsl,
    hslToHex,
    setHslColor,
  } from "baby-stats-lib/colors";
  import { setCssVariable } from "baby-stats-lib/css";
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { ColorType, HexColor } from "baby-stats-models/colors";
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let colorType: ColorType;

  const dispatch = createEventDispatcher<{ change: HexColor }>();

  let color = getHslColor(colorType);
  let colorHex = color ? hslToHex(color) : undefined;

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    color = hexToHsl(hex);

    if (!color) return;

    setHslColor(colorType, color);

    try {
      dispatch("change", HexColor.parse(hex));
    } catch (error) {
      console.error(error);
    }

    if (["background", "button"].includes(colorType)) {
      setCssVariable(
        `--${colorType}-font-color`,
        color.lightness > 60 ? "black" : "white",
      );
    }
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
