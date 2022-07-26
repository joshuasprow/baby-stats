<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import DatePicker from "./components/DatePicker.svelte";
  import Day from "./components/Day.svelte";
  import { days } from "./stores/days";
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
