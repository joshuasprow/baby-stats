<script lang="ts">
  import type { FeedSource, FeedSide } from "$models/feeds";

  export let amount: number;
  export let source: FeedSource;
  export let side: FeedSide | null;
</script>

{#if source === "bottle"}
  🍼{amount}oz
{:else if source === "breast"}
  🤱{amount * 5}min ({side})
{:else}
  {amount}
{/if}
