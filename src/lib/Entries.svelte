<script lang="ts">
  import type { Feed } from "./feeds";

  export let entries: Feed[];
  export let removeEntry: (timestamp: Date) => void;

  export let kind: "feed";
  export let icon: "🍼";
</script>

<div>
  <p>{kind}s:</p>
  {#if entries.length > 0}
    {#each entries as entry}
      <button on:click={() => removeEntry(entry.timestamp)}>{icon}</button>
    {/each}
  {:else}
    <span>🚫</span>
  {/if}
</div>
