<script lang="ts">
  import type { Entry, Icon, Kind } from "./entries";

  type K = Kind;

  export let icon: Icon<K>;
  export let entries: Entry<K>[];
  export let removeEntry: (timestamp: Date) => void;
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
