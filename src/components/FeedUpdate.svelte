<script lang="ts">
  import {
    isBreastFeed,
    removeFeed,
    updateFeed,
    type Feed,
    type FeedKind,
    type FeedSide,
  } from "../stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  type K = $$Generic<FeedKind>;

  export let feed: Feed<K>;

  let amount = feed.amount;
  let kind = feed.kind;
  let side: FeedSide | undefined;

  $: if (isBreastFeed(feed)) {
    side = feed.side;
  } else if (side === undefined) {
    side = "L";
  } else {
    side = undefined;
  }

  const onUpdateClick = () =>
    updateFeed({ amount, kind, side, timestamp: feed.timestamp });

  const onRemoveClick = () => removeFeed(feed.timestamp);
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
