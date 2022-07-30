<script lang="ts">
  import type { Feed } from "../stores/feeds.types";
  import FeedUpdate from "./FeedUpdate.svelte";

  export let feeds: Feed[];
</script>

<span>feeds: {feeds.length}</span>

{#if feeds.length === 0}
  <span>🚫</span>
{:else}
  {#each feeds as feed}
    <FeedUpdate
      timestamp={feed.timestamp}
      amount={feed.amount}
      source={feed.source}
      side={feed.side}
    />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
