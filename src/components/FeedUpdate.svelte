<script lang="ts">
  import { feeds, type Feed, type FeedSide } from "../stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  export let feed: Feed;

  let amount = feed.amount;
  let kind = feed.kind;
  let side: FeedSide | null = feed.side;

  const handleSide = (e: CustomEvent<FeedSide | null>) => {
    side = e.detail;
  };

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
    <FeedSideInput disabled={kind !== "breast"} on:change={handleSide} {side} />
  </article>
</EntryModal>
