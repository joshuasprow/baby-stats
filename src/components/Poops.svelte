<script lang="ts">
  import type { Poop } from "../stores/poops";
  import EntriesWrapper from "./EntriesWrapper.svelte";
  import PoopUpdate from "./PoopUpdate.svelte";

  export let poops: Poop[];
</script>

<EntriesWrapper label="poops" count={poops.length}>
  {#if poops.length === 0}
    <span>🚫</span>
  {:else}
    {#each poops as poop}
      <PoopUpdate timestamp={poop.timestamp} amount={poop.amount} />
    {/each}
  {/if}
</EntriesWrapper>
