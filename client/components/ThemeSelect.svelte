<script lang="ts">
  import { DEFAULT_THEME, type Theme } from "baby-stats-models/theme";
  import type { User } from "baby-stats-models/users";
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import CloseIcon from "./CloseIcon.svelte";

  export let id = "theme";
  export let themes: Theme[];
  export let user: User;

  $: if (themes.length === 0) {
    themes = [DEFAULT_THEME];
  }

  const dispatch = createEventDispatcher<{ remove: void; select: Theme }>();

  const handleChange = async (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;

    const theme = themes.find((t) => t.id === value);

    if (!theme) {
      console.error(`No theme found with selected id: ${value}`);
      return;
    }

    dispatch("select", theme);
  };

  const handleRemove = () => dispatch("remove");
</script>

<label for={id}>
  <span>theme</span>
  <select {id} on:change={handleChange}>
    {#each themes as { id, name }}
      <option value={id}>
        {id === user.themeId ? `${name} (default)` : name}
      </option>
    {/each}
  </select>
  <Button on:click={handleRemove}><CloseIcon /></Button>
</label>

<style>
  label {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    align-items: center;
    margin-bottom: 1rem;
  }

  select {
    border: var(--border);
    border-radius: var(--border-radius);
    margin-right: 0.5rem;
  }
</style>
