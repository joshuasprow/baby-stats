<script lang="ts">
  import { getHslColors, hexToHsl } from "baby-stats-lib/colors";
  import type { Colors, ColorsAdd, HexColor } from "baby-stats-models/colors";
  import { onMount } from "svelte";
  import ColorPicker from "./ColorPicker.svelte";

  // TODO: get defaults from 1. firestore; 2. css variables

  let id: string | null = null;
  let name = "Default";
  let colors: Omit<Colors, "id" | "name">;

  const handleBackground = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    colors.background = hsl;
  };

  const handleBorder = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    colors.border = hsl;
  };

  const handleButton = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    colors.button = hsl;
  };

  const handleSave = () => {
    console.log(colors);
  };

  onMount(() => {
    const [background, border, button] = getHslColors(
      "background",
      "border",
      "button",
    );

    colors = { background, border, button };
  });
</script>

<ColorPicker
  id="background-color"
  colorType="background"
  on:change={handleBackground}
/>
<ColorPicker id="border-color" colorType="border" on:change={handleBorder} />
<ColorPicker id="button-color" colorType="button" on:change={handleButton} />

<form on:submit|preventDefault={handleSave}>
  <label for="name">
    name
    <input id="name" type="text" bind:value={name} />
  </label>

  <button type="submit">save</button>
</form>
