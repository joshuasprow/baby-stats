<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import Signup from "./components/Auth.svelte";
  import FeedUpdate from "./components/FeedUpdate.svelte";
  import NapUpdate from "./components/NapUpdate.svelte";
  import PeeUpdate from "./components/PeeUpdate.svelte";
  import { feeds } from "./stores/feeds";
  import { naps } from "./stores/naps";
  import { pees } from "./stores/pees";
</script>

<main>
  <Signup />
  <Actions />
  <div>
    {#if !$feeds}
      <span>🚫</span>
    {:else}
      {#each $feeds as feed}
        <FeedUpdate {feed} />
      {/each}
    {/if}
  </div>
  <div>
    {#if !$naps}
      <span>🚫</span>
    {:else}
      {#each $naps as nap}
        <NapUpdate {nap} />
      {/each}
    {/if}
  </div>
  <div>
    {#if !$pees}
      <span>🚫</span>
    {:else}
      {#each $pees as pee}
        <PeeUpdate {pee} />
      {/each}
    {/if}
  </div>

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
