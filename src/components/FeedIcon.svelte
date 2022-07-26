<script lang="ts">
  import { isBreastFeed, type Feed, type FeedKind } from "../stores/feeds";

  export let feed: Feed<FeedKind>;

  $: amount = feed.amount;
  $: kind = feed.kind;
  $: side = isBreastFeed(feed) ? feed.side : "";

  $: if (kind === "bottle") {
    side = "";
  }
</script>

{#if kind === "bottle"}
  {amount}🍼
{:else if kind === "breast"}
  {amount}🤱{side}
{:else}
  {amount}
{/if}
