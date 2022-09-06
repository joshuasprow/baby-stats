<script lang="ts">
  import { setTheme, theme } from "$stores/theme";
  import { themes } from "$stores/themes";
  import { addTheme, updateTheme } from "baby-stats-firebase/themes";
  import { updateUserDoc } from "baby-stats-firebase/users";
  import { hexToHsl } from "baby-stats-lib/theme";
  import { isTheme, type HexColor, type Theme } from "baby-stats-models/theme";
  import type { User } from "baby-stats-models/users";
  import { db } from "../firebase";
  import ColorPicker from "./ColorPicker.svelte";
  import ThemeSelect from "./ThemeSelect.svelte";

  // TODO: get defaults from 1. firestore; 2. css variables
  // TODO: make button to set theme as default

  export let user: User;

  let id = isTheme($theme) ? $theme.id : null;
  let loading = false;

  const handleBackground = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    $theme.background = hsl;
  };

  const handleBorder = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    $theme.border = hsl;
  };

  const handleButton = (e: CustomEvent<HexColor>) => {
    const hsl = hexToHsl(e.detail);
    $theme.button = hsl;
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      if (!id) {
        console.error("No theme id available to update");
        return;
      }

      await updateTheme(db, user.uid, { ...$theme, id });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  const handleSave = async () => {
    loading = true;

    try {
      if ($themes.some((t) => t.name === $theme.name)) {
        await handleUpdate();
      } else {
        await addTheme(db, user.uid, { ...$theme });
      }
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  const handleSelect = (e: CustomEvent<Theme>) => setTheme(e.detail);

  const handleSetDefault = async () => {
    loading = true;

    try {
      if (!id) {
        throw new Error("No theme id available to set as default");
      }

      await updateUserDoc(db, { uid: user.uid, themeId: id });
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };
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
      type="search"
      bind:value={$theme.name}
    />
  </label>

  <ThemeSelect on:select={handleSelect} />

  <button disabled={loading} type="submit">save</button>
  <button disabled={loading} on:click|preventDefault={handleSetDefault}>
    set as default
  </button>
</form>
