<script lang="ts">
  import { isBreastFeed, type Feed } from "../stores/feeds";

  export let feed: Feed;

  $: amount = feed.amount;
  $: kind = feed.kind;
  $: side = isBreastFeed(feed) ? feed.side : "";
</script>

{#if kind === "bottle"}
  {amount}🍼
{:else if kind === "breast"}
  {amount}🤱{side}
{:else}
  {amount}
{/if}
