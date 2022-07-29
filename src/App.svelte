<script lang="ts">
  import Signup from "./components/Auth.svelte";
  import FeedUpdate from "./components/FeedUpdate.svelte";
  import { feeds } from "./stores/feeds";
</script>

<main>
  <Signup />

  {#if !$feeds}
    <span>🚫</span>
  {:else}
    {#each $feeds as feed}
      <FeedUpdate {feed} />
    {/each}
  {/if}

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
