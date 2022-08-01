<script lang="ts" context="module">
  const formatDaystamp = (daystamp: number) =>
    new Date(daystamp).toDateString();
</script>

<script lang="ts">
  import { days } from "$stores/days";
  import Entry from "./Entry.svelte";
</script>

{#each $days as [daystamp, day] (daystamp)}
  <span class="date">{formatDaystamp(daystamp)}</span>

  {#each day as [_, entry] (entry.id)}
    <Entry {entry} />
  {/each}
{/each}

<style>
  .date {
    font-size: 0.75rem;
    color: #888;
  }
</style>
