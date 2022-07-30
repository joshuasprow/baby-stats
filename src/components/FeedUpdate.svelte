<script lang="ts">
  import { removeFeed, updateFeed } from "$stores/feeds";
  import type { FeedSide, FeedSource } from "$stores/feeds.types";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let timestamp: Date;
  export let amount: number;
  export let source: FeedSource;
  export let side: FeedSide | null;

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
    updateFeed({ amount, kind: source, side, timestamp });

  const onRemoveClick = () => removeFeed(timestamp);
</script>

<EntryModal okText="update" onOk={onUpdateClick} onRemove={onRemoveClick}>
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
