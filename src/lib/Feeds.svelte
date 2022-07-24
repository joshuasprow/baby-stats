<script lang="ts">
  import Feed from "./Feed.svelte";
  import type { Feed as FeedType, FeedKind } from "./feeds";

  export let feeds: FeedType<FeedKind>[];
</script>

<span>feeds: {feeds.length}</span>

{#if feeds.length === 0}
  <span>🚫</span>
{:else}
  {#each feeds as feed}
    <Feed {feed} />
  {/each}
{/if}

<style>
  span {
    display: block;
  }
</style>
