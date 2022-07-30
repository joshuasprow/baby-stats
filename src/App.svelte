<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import Signup from "./components/Auth.svelte";
  import DatePicker from "./components/DatePicker.svelte";
  import Day from "./components/Day.svelte";
  import { days } from "./stores/days";
</script>

<main>
  <Signup />
  <Actions />
  <DatePicker />

  {#each Object.entries($days) as [timestamp, day]}
    <Day {timestamp} {day} />
  {/each}
</main>
