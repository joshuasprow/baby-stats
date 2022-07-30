<script lang="ts">
  import type { Feed } from "$stores/feeds";
  import EntriesWrapper from "./EntriesWrapper.svelte";
  import FeedUpdate from "./FeedUpdate.svelte";

  export let feeds: Feed[];
</script>

<EntriesWrapper label="feeds" count={feeds.length}>
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
</EntriesWrapper>
