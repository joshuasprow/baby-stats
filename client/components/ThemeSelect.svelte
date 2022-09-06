<script lang="ts">
  import { themes } from "$stores/themes";
  import type { Theme } from "baby-stats-models/theme";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ select: Theme }>();

  const handleChange = async (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const id = target.value;

    const theme = $themes.find((t) => t.id === id);

    if (!theme) {
      console.error(`No theme found with selected id: ${id}`);
      return;
    }

    dispatch("select", theme);
  };
</script>

<select id="theme" on:change={handleChange}>
  {#each $themes as { id, name }}
    <option value={id}>{name}</option>
  {/each}
</select>
