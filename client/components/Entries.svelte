<script lang="ts">
  import Day from "$components/Day.svelte";
  import { days } from "$stores/days";
</script>

{#each $days as [daystamp, day] (daystamp)}
  <Day {daystamp} {day} />
{/each}
