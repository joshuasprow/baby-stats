<script lang="ts">
  import PeeUpdate from "./PeeUpdate.svelte";
  import type { Pee } from "../stores/pees";
  import EntriesWrapper from "./EntriesWrapper.svelte";

  export let pees: Pee[];
</script>

<EntriesWrapper label="pees" count={pees.length}>
  {#if pees.length === 0}
    <span>🚫</span>
  {:else}
    {#each pees as pee}
      <PeeUpdate timestamp={pee.timestamp} amount={pee.amount} />
    {/each}
  {/if}
</EntriesWrapper>
