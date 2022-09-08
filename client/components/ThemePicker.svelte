<script lang="ts">
  import { setTheme, theme } from "$stores/theme";
  import { themes } from "$stores/themes";
  import { addTheme, updateTheme } from "baby-stats-firebase/themes";
  import { updateUserDoc } from "baby-stats-firebase/users";
  import { isTheme, ThemeElement, type Theme } from "baby-stats-models/theme";
  import type { User } from "baby-stats-models/users";
  import { db } from "../firebase";
  import Button from "./Button.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import ThemeSelect from "./ThemeSelect.svelte";

  export let user: User;

  let id = isTheme($theme) ? $theme.id : null;
  let loading = false;

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

  const handleElementChange = <E extends ThemeElement>(
    event: CustomEvent<{ element: E; value: Theme[E] }>,
  ) => {
    const { element, value } = event.detail;

    setTheme({ ...$theme, [element]: value });
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

<section>
  <ColorPicker element="background" on:change={handleElementChange} />
  <ColorPicker element="border" on:change={handleElementChange} />
  <ColorPicker element="button" on:change={handleElementChange} />

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

    <ThemeSelect id="theme" on:select={handleSelect} />

    <div class="controls">
      <Button disabled={loading} type="submit">save</Button>
      <Button disabled={loading} on:click={handleSetDefault}>
        set as default
      </Button>
    </div>
  </form>
</section>

<style>
  label {
    display: grid;
    grid-template-columns: 6rem 6rem;
    margin-bottom: 0.5rem;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }
</style>
