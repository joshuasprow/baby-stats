<script lang="ts">
  import FeedUpdate from "./FeedUpdate.svelte";
  import type { Feed, FeedKind } from "../lib/feeds";

  export let feeds: Feed<FeedKind>[];
</script>

<span>feeds: {feeds.length}</span>

{#if feeds.length === 0}
  <span>🚫</span>
{:else}
  {#each feeds as feed}
    <FeedUpdate {feed} />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
