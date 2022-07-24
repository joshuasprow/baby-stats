<script lang="ts">
  import { feeds, removeFeed } from "./feeds";
</script>

<div>
  <p>feeds:</p>
  {#if $feeds.length > 0}
    {#each $feeds as feed}
      <button on:click={() => removeFeed(feed.timestamp)}>🍼</button>
    {/each}
  {:else}
    <span>🚫</span>
  {/if}
</div>
