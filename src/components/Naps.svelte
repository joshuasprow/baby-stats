<script lang="ts">
  import NapUpdate from "./NapUpdate.svelte";
  import type { Nap } from "../stores/naps";

  export let naps: Nap[];
</script>

<span>naps: {naps.length}</span>

{#if naps.length === 0}
  <span>🚫</span>
{:else}
  {#each naps as nap}
    <NapUpdate {nap} />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
