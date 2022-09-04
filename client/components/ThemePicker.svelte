<script lang="ts">
  import { addTheme, updateTheme } from "baby-stats-firebase/themes";
  import { getUser } from "baby-stats-firebase/users";
  import { hexToHsl } from "baby-stats-lib/theme";
  import {
    DEFAULT_THEME,
    type HexColor,
    type Theme,
  } from "baby-stats-models/theme";
  import type { User } from "baby-stats-models/users";
  import { onMount } from "svelte";
  import { db } from "../firebase";
  import { themes, themesLoaded } from "../stores/themes";
  import ColorPicker from "./ColorPicker.svelte";

  // TODO: get defaults from 1. firestore; 2. css variables

  export let user: User;

  let id: string | null = null;
  let name = "Default";
  let theme: Omit<Theme, "id" | "name">;

  let loading = false;

  const handleBackground = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    theme.background = hsl;
  };

  const handleBorder = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    theme.border = hsl;
  };

  const handleButton = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    theme.button = hsl;
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      if (!id) return;

      await updateTheme(db, user.uid, { ...theme, id, name });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  const handleSave = async () => {
    loading = true;

    try {
      const idx = $themes.findIndex((t) => t.name === name);

      console.log(idx);

      if (idx !== -1) {
        const id = $themes[idx].id;
        console.log(id);

        await updateTheme(db, user.uid, { ...theme, id, name });
      } else {
        await addTheme(db, user.uid, { ...DEFAULT_THEME, ...theme, name });
      }
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  onMount(async () => {
    console.log(await getUser(db, user.uid));
    // const [background, border, button] = getHslTheme(
    //   "background",
    //   "border",
    //   "button",
    // );
    // theme = { background, border, button };
    // console.log(JSON.stringify({ name, ...theme }));
  });
</script>

<ColorPicker
  id="background-color"
  element="background"
  on:change={handleBackground}
/>
<ColorPicker id="border-color" element="border" on:change={handleBorder} />
<ColorPicker id="button-color" element="button" on:change={handleButton} />

<form disabled={loading} on:submit|preventDefault={handleSave}>
  <label for="name">
    name
    <input
      disabled={loading}
      id="name"
      list="themes"
      type="search"
      bind:value={name}
    />

    <datalist id="themes">
      {#if $themesLoaded}
        {#each $themes as theme}
          <option value={theme.name} />
        {/each}
      {/if}
    </datalist>
  </label>

  <button disabled={loading} type="submit">save</button>
</form>
