<script lang="ts">
  import PeeUpdate from "./PeeUpdate.svelte";
  import type { Pee } from "../stores/pees";

  export let pees: Pee[];
</script>

<span>pees: {pees.length}</span>

{#if pees.length === 0}
  <span>🚫</span>
{:else}
  {#each pees as pee}
    <PeeUpdate timestamp={pee.timestamp} amount={pee.amount} />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
