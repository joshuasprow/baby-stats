<script lang="ts">
  import { type Feed, removeFeed, updateFeed } from "$stores/feeds";
  import type { FeedSide, FeedSource } from "$stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let entry: Feed;

  let amount = entry.amount;
  let source = entry.source;
  let side: FeedSide | null = entry.side;

  const handleAmount = (e: CustomEvent<number>) => {
    amount = e.detail;
  };

  const handleKind = (e: CustomEvent<FeedSource>) => {
    source = e.detail;
    if (source === "bottle") {
      side = null;
    }
    if (source === "breast" && side === null) {
      side = "L";
    }
  };

  const handleSide = (e: CustomEvent<FeedSide | null>) => {
    side = e.detail;
  };

  const onUpdateClick = () =>
    updateFeed({
      id: entry.id,
      amount,
      kind: "feeds",
      side,
      source,
      timestamp: entry.timestamp,
    } as Feed);

  const onRemoveClick = () => removeFeed(entry.id);
</script>

<EntryModal
  okText="update"
  okCallback={onUpdateClick}
  removeCallback={onRemoveClick}
>
  <FeedIcon {amount} {source} {side} slot="icon" />

  <article>
    <FeedAmountInput on:change={handleAmount} {amount} />
  </article>

  <article>
    kind:
    <FeedSourceInput on:change={handleKind} {source} />
  </article>

  <article>
    side:
    <FeedSideInput
      disabled={source !== "breast"}
      on:change={handleSide}
      {side}
    />
  </article>
</EntryModal>
