<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import DatePicker from "./components/DatePicker.svelte";
  import Day from "./components/Day.svelte";
  import { days } from "./stores/days";
  import Signup from "./components/Auth.svelte";
  import { feeds } from "./stores/feeds";
</script>

<main>
  <Signup />

  {#each $feeds as feed}
    <pre>{JSON.stringify(feed)}</pre>
  {/each}

  <!-- <DatePicker />

  <Actions />

  <span>days:</span>

  {#each Object.entries($days) as [timestamp, day]}
    <Day {timestamp} {day} />
  {/each} -->
</main>

<style>
  span {
    display: block;
    text-decoration: underline;
  }
</style>
