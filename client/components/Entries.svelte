<script lang="ts">
  import Day from "$components/Day.svelte";
  import type { Day as DayType } from "$stores/days";

  export let babyId: string;
  export let days: DayType[];
</script>

{#if days.length === 0}
  <span>Use the buttons below to add new entries</span>
{:else}
  {#each days as [daystamp, day] (daystamp)}
    <Day {babyId} {day} {daystamp} />
  {/each}
{/if}
