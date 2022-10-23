<script lang="ts">
  import Day from "$components/Day.svelte";
  import type { Day as DayType } from "$stores/days";

  export let babyId: string;
  export let days: DayType[];
</script>

{#each days as [daystamp, day] (daystamp)}
  <Day {daystamp} {day} {babyId} />
{/each}
