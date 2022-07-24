<script lang="ts">
  import { removeFeed, type Feed, type FeedKind } from "./feeds";

  export let feeds: Feed<FeedKind>[];

  $: bottle = feeds.filter((f) => f.kind === "bottle");
  $: breast = feeds.filter((f) => f.kind === "breast");
</script>

<span>feeds: {feeds.length}</span>

<span>bottle: {bottle.length}</span>
<span>breast: {breast.length}</span>

{#if feeds.length === 0}
  <span>🚫</span>
{:else}
  {#each feeds as feed}
    {#if feed.kind === "bottle"}
      <button on:click={() => removeFeed(feed.timestamp)}>🍼</button>
    {:else if feed.kind === "breast"}
      <button on:click={() => removeFeed(feed.timestamp)}>
        🤱 {feed.side}
      </button>
    {:else}
      <span>{`invalid kind: ${feed.kind}`}</span>
    {/if}
  {/each}
{/if}

<style>
  span {
    display: block;
  }

  button {
    margin: 0 0.25rem;
  }
</style>
