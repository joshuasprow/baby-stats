<script lang="ts">
  import type { Feed, FeedKind, FeedSide } from "../stores/feeds.types";
  import { removeFeed, updateFeed } from "../stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  export let feed: Feed;

  let amount = feed.amount;
  let kind = feed.kind;
  let side: FeedSide | null = feed.side;

  const handleAmount = (e: CustomEvent<number>) => {
    amount = e.detail;
  };

  const handleKind = (e: CustomEvent<FeedKind>) => {
    kind = e.detail;
    if (kind === "bottle") {
      side = null;
    }
    if (kind === "breast" && side === null) {
      side = "L";
    }
  };

  const handleSide = (e: CustomEvent<FeedSide | null>) => {
    side = e.detail;
  };

  const onUpdateClick = () =>
    updateFeed({ amount, kind, side, timestamp: feed.timestamp });

  const onRemoveClick = () => removeFeed(feed.timestamp);
</script>

<EntryModal okText="update" onOk={onUpdateClick} onRemove={onRemoveClick}>
  <FeedIcon {feed} slot="icon" />

  <article>
    <FeedAmountInput on:change={handleAmount} {amount} />
  </article>

  <article>
    kind:
    <FeedKindInput on:change={handleKind} {kind} />
  </article>

  <article>
    side:
    <FeedSideInput disabled={kind !== "breast"} on:change={handleSide} {side} />
  </article>
</EntryModal>
