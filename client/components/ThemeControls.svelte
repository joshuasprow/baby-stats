<script lang="ts">
  import {
    addColors,
    getUserTheme,
    updateColors,
  } from "baby-stats-firebase/colors";
  import { hexToHsl } from "baby-stats-lib/colors";
  import type { Colors, HexColor } from "baby-stats-models/colors";
  import type { User } from "baby-stats-models/users";
  import { onMount } from "svelte";
  import { db } from "../firebase";
  import ColorPicker from "./ColorPicker.svelte";

  // TODO: get defaults from 1. firestore; 2. css variables

  export let user: User;

  let id: string | null = null;
  let name = "Default";
  let colors: Omit<Colors, "id" | "name">;

  let loading = false;

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

  const handleSave = async () => {
    loading = true;

    try {
      await addColors(db, user.uid, { ...colors, name });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      if (!id) return;

      await updateColors(db, user.uid, { ...colors, id, name });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  onMount(async () => {
    console.log(await getUserTheme(db, user.uid, user.themeId));
    // const [background, border, button] = getHslColors(
    //   "background",
    //   "border",
    //   "button",
    // );
    // colors = { background, border, button };
    // console.log(JSON.stringify({ name, ...colors }));
  });
</script>

<ColorPicker
  id="background-color"
  colorType="background"
  on:change={handleBackground}
/>
<ColorPicker id="border-color" colorType="border" on:change={handleBorder} />
<ColorPicker id="button-color" colorType="button" on:change={handleButton} />

<form disabled={loading} on:submit|preventDefault={handleSave}>
  <label for="name">
    name
    <input disabled={loading} id="name" type="text" bind:value={name} />
  </label>

  <button disabled={loading} type="submit">save</button>
</form>
