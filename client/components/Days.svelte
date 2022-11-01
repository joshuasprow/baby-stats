<script lang="ts">
  import type { Day as DayType } from "../stores/days";
  import Day from "./Day.svelte";

  export let days: DayType[];
</script>

{#if days.length === 0}
  <span>Use the buttons below to add new entries</span>
{:else}
  {#each days as [daystamp, day] (daystamp)}
    <Day {day} {daystamp} />
  {/each}
{/if}
