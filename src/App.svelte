<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import DatePicker from "./lib/DatePicker.svelte";
  import Day from "./lib/Day.svelte";
  import { days } from "./lib/days";
</script>

<main>
  <DatePicker />

  <Actions />

  <span>days:</span>

  {#each Object.entries($days) as [timestamp, day]}
    <Day {timestamp} {day} />
  {/each}
</main>

<style>
  span {
    display: block;
    text-decoration: underline;
  }
</style>
