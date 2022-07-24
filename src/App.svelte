<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import Day from "./lib/Day.svelte";
  import { days } from "./lib/days";
  import DevDate from "./lib/DevDate.svelte";
</script>

<main>
  <DevDate />

  <Actions />

  {#each Object.entries($days) as [timestamp, day]}
    <Day {timestamp} {day} />
  {/each}
</main>
