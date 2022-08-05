<script lang="ts">
  import type { Feed, FeedSide, FeedSource } from "$models/feeds";
  import { removeFeed, updateFeed } from "$stores/feeds";
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
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
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <FeedIcon {amount} {source} {side} slot="icon" />

  <article>
    <FeedAmountInput {loading} on:change={handleAmount} {amount} {source} />
  </article>

  <article>
    <FeedSourceInput {loading} on:change={handleKind} {source} />
  </article>

  <article>
    <FeedSideInputGroup
      disabled={loading || source !== "breast"}
      on:change={handleSide}
      {side}
    />
  </article>
</EntryUpdateModal>
