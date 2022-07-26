<script lang="ts">
  import type { Entry } from "../lib/entry";
  import { getIconForKind } from "../lib/icon";
  import type { Kind } from "../lib/kind";

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
