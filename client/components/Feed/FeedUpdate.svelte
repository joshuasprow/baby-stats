<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import FeedIcon from "$components/Feed/FeedIcon.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { removeFeed, updateFeed } from "$stores/feeds";
  import { parseError } from "baby-stats-lib/error";
  import type { TimeRangeAmount } from "baby-stats-models/entries";
  import {
    Feed,
    type FeedSide,
    type FeedSource,
  } from "baby-stats-models/feeds";
  import type { ZodError } from "zod";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import BreastFeedAmountInput from "./BreastFeedAmountInput.svelte";

  export let entry: Feed;

  let error: null | string = null;
  let loading = false;

  let update: Feed;
  try {
    update = Feed.parse({
      id: entry.id,
      amount: entry.amount,
      kind: "feeds",
      source: entry.source,
      side: entry.side,
      timestamp: entry.timestamp,
    });
  } catch (e) {
    error = (e as ZodError<Feed>).message;
  }

  const setUpdate = (fields: Partial<Feed>) => {
    const [u, e] = addEntryFields(Feed, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateFeed(update);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };

  const handleBottleAmount = async (e: CustomEvent<number>) => {
    setUpdate({ amount: e.detail });

    await handleUpdate();
  };

  const handleBreastAmount = async (e: CustomEvent<TimeRangeAmount>) => {
    const amount = e.detail;

    setUpdate({ amount, timestamp: amount.start });

    await handleUpdate();
  };

  const handleSource = async (e: CustomEvent<FeedSource>) => {
    const source = e.detail;

    setUpdate(
      source === "bottle"
        ? { side: null, source }
        : { side: entry.side || "L", source }
    );

    await handleUpdate();
  };

  const handleSide = async (e: CustomEvent<FeedSide | null>) => {
    setUpdate({ side: e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    setUpdate({ timestamp: e.detail });

    await handleUpdate();
  };

  const handleRemove = async () => {
    loading = true;

    try {
      await removeFeed(entry.id);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryUpdateModal {loading} on:remove={handleRemove}>
  <FeedIcon
    amount={update.amount}
    source={update.source}
    side={update.side}
    slot="icon"
  />

  <article>
    {#if update.source === "bottle"}
      <BottleFeedAmountInput
        amount={update.amount}
        {loading}
        on:amount={handleBottleAmount}
        on:timestamp={handleTimestamp}
        timestamp={update.timestamp}
      />
    {:else if update.source === "breast"}
      <BreastFeedAmountInput
        amount={update.amount}
        {loading}
        on:change={handleBreastAmount}
      />
    {:else}
      🚫 unknown source
    {/if}
  </article>

  <article>
    <FeedSourceInput
      {loading}
      on:change={handleSource}
      source={update.source}
    />
  </article>

  {#if update.source === "breast"}
    <article>
      <FeedSideInputGroup {loading} on:change={handleSide} side={update.side} />
    </article>
  {/if}

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryUpdateModal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
