<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import Day from "./lib/Day.svelte";
  import { days } from "./lib/days";
</script>

<main>
  <Actions />

  {#each Object.entries($days) as [_, day]}
    <Day {day} />
  {/each}
</main>
