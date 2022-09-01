<script lang="ts">
  import type { Colors, HexColor } from "baby-stats-models/colors";
  import ColorPicker from "./ColorPicker.svelte";

  // TODO: get defaults from 1. firestore; 2. css variables
  let colors: Colors;

  const handleBackground = (e: CustomEvent<HexColor>) => {
    console.log("background", e.detail);
  };

  const handleBorder = (e: CustomEvent<HexColor>) => {
    console.log("border", e.detail);
  };

  const handleButton = (e: CustomEvent<HexColor>) => {
    console.log("button", e.detail);
  };
</script>

<ColorPicker
  id="background-color"
  colorType="background"
  on:change={handleBackground}
/>
<ColorPicker id="border-color" colorType="border" on:change={handleBorder} />
<ColorPicker id="button-color" colorType="button" on:change={handleButton} />
