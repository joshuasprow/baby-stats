<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    isBreastFeed,
    isFeed,
    updateFeed,
    type Feed,
    type FeedKind,
    type FeedSide,
  } from "./feeds";

  export let feed: Feed<FeedKind>;

  let open = false;

  let amount = feed.amount;
  let kind: FeedKind = feed.kind;
  let side: FeedSide | "" = isBreastFeed(feed) ? feed.side : "";

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
