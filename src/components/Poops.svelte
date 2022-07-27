<script lang="ts">
  import type { Poop } from "../stores/poops";
  import PoopUpdate from "./PoopUpdate.svelte";

  export let poops: Poop[];
</script>

<span>poops: {poops.length}</span>

{#if poops.length === 0}
  <span>🚫</span>
{:else}
  {#each poops as poop}
    <PoopUpdate {poop} />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
