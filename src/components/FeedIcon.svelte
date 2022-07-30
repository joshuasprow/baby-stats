<script lang="ts">
  import type { FeedKind, FeedSide } from "../stores/feeds.types";

  export let amount: number;
  export let kind: FeedKind;
  export let side: FeedSide | null;
</script>

{#if kind === "bottle"}
  {amount}🍼
{:else if kind === "breast"}
  {amount}🤱{side}
{:else}
  {amount}
{/if}
