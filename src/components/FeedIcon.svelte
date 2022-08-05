<script lang="ts">
  import type { FeedSide, FeedSource } from "$models/feeds";
  import EntryIcon from "./EntryIcon.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";

  export let amount: number;
  export let source: FeedSource;
  export let side: FeedSide | null;
</script>

<EntryIcon>
  {#if source === "bottle"}
    <span>🍼</span><span>{amount}oz</span>
  {:else if source === "breast"}
    <span>🤱</span><span>{amount * 5}min</span><span>{side}</span>
  {:else}
    <span /><ErrorMessage message={`invalid source: ${source}`} />
  {/if}
</EntryIcon>
