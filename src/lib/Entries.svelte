<script lang="ts">
  import type { Feed } from "./feeds";
  import type { Nap } from "./naps";

  export let entries: (Feed | Nap)[];
  export let removeEntry: (timestamp: Date) => void;

  export let kind: "feed" | "nap" | "pee" | "poop";
  export let icon: "🍼" | "💤" | "💧" | "💩";
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
