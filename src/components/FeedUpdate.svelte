<script lang="ts">
  import type { Feed, FeedSide, FeedSource } from "$models/feeds";
  import { removeFeed, updateFeed } from "$stores/feeds";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedSideInputGroup from "./FeedSideInputGroup.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let entry: Feed;

  let amount = entry.amount;
  let source = entry.source;
  let side: FeedSide | null = entry.side;
  let timestamp = entry.timestamp;

  let loading = false;

  const update = async () => {
    loading = true;

    await updateFeed({
      id: entry.id,
      amount,
      kind: "feeds",
      side,
      source,
      timestamp,
    } as Feed);

    loading = false;
  };

  const handleAmount = async (e: CustomEvent<number>) => {
    amount = e.detail;
    await update();
  };

  const handleKind = async (e: CustomEvent<FeedSource>) => {
    source = e.detail;
    if (source === "bottle") {
      side = null;
    }
    if (source === "breast" && side === null) {
      side = "L";
    }
    await update();
  };

  const handleSide = async (e: CustomEvent<FeedSide | null>) => {
    side = e.detail;
    await update();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    timestamp = e.detail;
    await update();
  };

  const handleRemove = () => removeFeed(entry.id);
</script>

<EntryUpdateModal
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
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
    <FeedSideInputGroup
      disabled={source !== "breast"}
      on:change={handleSide}
      {side}
    />
  </article>
</EntryUpdateModal>
