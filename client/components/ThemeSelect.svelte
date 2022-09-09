<script lang="ts">
  import { themes } from "$stores/themes";
  import type { Theme } from "baby-stats-models/theme";
  import { createEventDispatcher } from "svelte";

  export let id = "theme";

  const dispatch = createEventDispatcher<{ select: Theme }>();

  const handleChange = async (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;

    const theme = $themes.find((t) => t.id === value);

    if (!theme) {
      console.error(`No theme found with selected id: ${value}`);
      return;
    }

    dispatch("select", theme);
  };
</script>

<label for={id}>
  <select {id} on:change={handleChange}>
    {#each $themes as { id, name }}
      <option value={id}>{name}</option>
    {/each}
  </select>
</label>

<style>
  label {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  select {
    grid-column-start: 2;
  }
</style>
