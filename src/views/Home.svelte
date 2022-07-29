<script lang="ts">
  import { onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import Actions from "../components/Actions.svelte";
  import DatePicker from "../components/DatePicker.svelte";
  import Day from "../components/Day.svelte";
  import { auth } from "../lib/firebase";
  import { days } from "../stores/days";

  onMount(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        console.log(user);
      },
      (error) => {
        console.error(error);
      }
    );
  });
</script>

<main>
  <a href="/about">about</a>
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
