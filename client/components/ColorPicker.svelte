<script lang="ts">
  import {
    getHslColor,
    hexToHsl,
    hslToHex,
    setHslColor,
  } from "baby-stats-lib/theme";
  import { setCssVariable } from "baby-stats-lib/css";
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { ThemeElement, HexColor } from "baby-stats-models/theme";
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let element: ThemeElement;

  const dispatch = createEventDispatcher<{ change: HexColor }>();

  let color = getHslColor(element);
  let colorHex = color ? hslToHex(color) : undefined;

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;

    color = hexToHsl(hex);

    if (!color) return;

    setHslColor(element, color);

    try {
      dispatch("change", HexColor.parse(hex));
    } catch (error) {
      console.error(error);
    }

    if (["background", "button"].includes(element)) {
      setCssVariable(
        `--${element}-font-color`,
        color.lightness > 60 ? "black" : "white",
      );
    }
  };
</script>

<label for={id}>
  {element}
  <input on:input={handleColorChange} {id} type="color" value={colorHex} />
</label>

<style>
  label {
    display: block;
  }
</style>
