<script lang="ts">
  import {
    DEFAULT_THEME,
    ThemeElement,
    type Theme,
  } from "@baby-stats/models/theme";
  import type { User } from "@baby-stats/models/users";
  import { db } from "../firebase";
  import logger from "../firebase/logger";
  import { addTheme, removeTheme, updateTheme } from "../firebase/themes";
  import { updateUserDoc } from "../firebase/users";
  import { parseError } from "../lib/error";
  import { setTheme, theme } from "../stores/theme";
  import { themes } from "../stores/themes";
  import Button from "./Button.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import ThemeSelect from "./ThemeSelect.svelte";

  export let user: User;

  let disabled = false;

  const handleSave = async () => {
    disabled = true;

    try {
      if (!$theme.id) {
        logger.error(new Error("No theme id available to update"));
        return;
      }

      await updateTheme(db, user.uid, { ...$theme });
    } catch (e) {
      logger.error(parseError(e));
    }

    disabled = false;
  };

  const handleElementChange = <E extends ThemeElement>(
    event: CustomEvent<{ element: E; value: Theme[E] }>,
  ) => {
    const { element, value } = event.detail;

    setTheme({ ...$theme, [element]: value });
  };

  const handleSelect = (e: CustomEvent<Theme>) => setTheme(e.detail);

  const handleAdd = async () => {
    disabled = true;

    try {
      const next = await addTheme(db, user.uid, {
        ...DEFAULT_THEME,
        name: "New Theme",
      });

      setTheme(next);
    } catch (e) {
      logger.error(parseError(e));
    }

    disabled = false;
  };

  const handleRemove = async () => {
    disabled = true;

    try {
      if (!$theme.id) {
        logger.error(new Error("No theme id available to remove"));
        return;
      }

      // if the user has more themes available, find the next one to select
      let next = $themes.find((t) => t.id !== $theme.id);

      if (!next) {
        // if not, add the default theme to their collection
        next = await addTheme(db, user.uid, DEFAULT_THEME);
      }

      setTheme(next);

      // remove the theme and set the next one as the user's default
      await updateUserDoc(db, { uid: user.uid, themeId: next.id });
      await removeTheme(db, user.uid, $theme.id);
    } catch (e) {
      logger.error(parseError(e));
    }

    disabled = false;
  };

  const handleSetDefault = async () => {
    disabled = true;

    try {
      if (!$theme.id) {
        logger.error(new Error("No theme id available to set as default"));
        return;
      }

      await updateUserDoc(db, { uid: user.uid, themeId: $theme.id });
    } catch (e) {
      logger.error(parseError(e));
    }

    disabled = false;
  };
</script>

<form {disabled} on:submit|preventDefault>
  <div class="inputs">
    <ThemeSelect
      id="theme"
      on:remove={handleRemove}
      on:select={handleSelect}
      themes={$themes}
      {user}
    />

    <ColorPicker element="background" on:change={handleElementChange} />
    <ColorPicker element="border" on:change={handleElementChange} />
    <ColorPicker element="button" on:change={handleElementChange} />

    <label for="name">
      name
      <input
        class="theme-name-input"
        {disabled}
        id="name"
        bind:value={$theme.name}
      />
    </label>
  </div>

  <div class="controls">
    <Button {disabled} on:click={handleAdd}>➕</Button>
    <Button {disabled} on:click={handleSave}>save</Button>
    <Button {disabled} on:click={handleSetDefault}>set as default</Button>
  </div>
</form>

<style>
  .inputs {
    margin-bottom: 1rem;
  }

  label {
    display: grid;
    grid-template-columns: 6rem 6rem;
    margin-bottom: 0.5rem;
    align-items: center;
  }

  .controls {
    display: flex;
    justify-content: space-evenly;
    gap: 0.5rem;
  }

  .theme-name-input {
    background: var(--background);
    color: var(--background-font-color);
    border: var(--border);
    border-radius: var(--border-radius);
  }
</style>
