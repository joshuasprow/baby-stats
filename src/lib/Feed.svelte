<script lang="ts">
  import { removeFeed, type Feed, type FeedKind } from "./feeds";

  type K = $$Generic<FeedKind>;

  export let feed: Feed<K>;

  let icon = "🚫";

  $: if (feed.kind === "bottle") {
    icon = `${feed.amount}🍼`;
  } else if (feed.kind === "breast") {
    icon = `${feed.amount}🤱${(feed as unknown as Feed<"breast">).side}`;
  }
</script>

<button on:click={() => removeFeed(feed.timestamp)}>{icon}</button>

<style>
  button {
    margin: 0 0.25rem;
  }
</style>
