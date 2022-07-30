<script lang="ts">
  import type { FeedSource, FeedSide } from "$stores/feeds.types";

  export let amount: number;
  export let source: FeedSource;
  export let side: FeedSide | null;
</script>

{#if source === "bottle"}
  {amount}🍼
{:else if source === "breast"}
  {amount}🤱{side}
{:else}
  {amount}
{/if}
