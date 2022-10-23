<script lang="ts">
  import Day from "$components/Day.svelte";
  import { days } from "$stores/days";

  export let babyId: string;
</script>

{#each $days as [daystamp, day] (daystamp)}
  <Day {daystamp} {day} {babyId} />
{/each}
