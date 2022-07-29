<script lang="ts">
  import {
    feeds,
    isBreastFeed,
    removeFeed,
    type Feed,
    type FeedSide,
  } from "../stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  export let feed: Feed;

  let amount = feed.amount;
  let kind = feed.kind;
  let side: FeedSide | null;

  $: if (kind === "breast") {
    side = feed.side || "L";
  } else {
    side = null;
  }

  const onUpdateClick = () =>
    feeds.update({ amount, kind, side, timestamp: feed.timestamp });

  const onRemoveClick = () => feeds.remove(feed.timestamp);
</script>

<EntryModal okText="update" onOk={onUpdateClick} onRemove={onRemoveClick}>
  <FeedIcon {feed} slot="icon" />

  <article>
    <FeedAmountInput bind:amount />
  </article>

  <article>
    kind:
    <FeedKindInput bind:kind />
  </article>

  <article>
    side:
    <FeedSideInput disabled={kind !== "breast"} bind:side />
  </article>
</EntryModal>
