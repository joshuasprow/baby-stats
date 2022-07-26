<script lang="ts">
  import { getIconForKind, type Entry, type Kind } from "../lib/entries";

  type K = $$Generic<Kind>;

  export let kind: K;
  export let entries: Entry<K>[];
  export let removeEntry: (timestamp: Date) => void;

  let icon = getIconForKind(kind);
</script>

<div>
  {#if entries.length > 0}
    {#each entries as entry}
      <button on:click={() => removeEntry(entry.timestamp)}>{icon}</button>
    {/each}
  {:else}
    <span>🚫</span>
  {/if}
</div>
