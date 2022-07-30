<script lang="ts">
  import type { Nap } from "$stores/naps";
  import EntriesWrapper from "./EntriesWrapper.svelte";
  import NapUpdate from "./NapUpdate.svelte";

  export let naps: Nap[];
</script>

<EntriesWrapper label="naps" count={naps.length}>
  {#if naps.length === 0}
    <span>🚫</span>
  {:else}
    {#each naps as nap}
      <NapUpdate timestamp={nap.timestamp} amount={nap.amount} />
    {/each}
  {/if}
</EntriesWrapper>
