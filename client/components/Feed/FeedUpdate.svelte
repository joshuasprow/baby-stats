<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import FeedIcon from "$components/Feed/FeedIcon.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";
  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import { db } from "$firebase";
  import { removeFeed, updateFeed } from "@baby-stats/firebase/feeds";
  import { parseError } from "@baby-stats/lib/error";
  import { Feed, type FeedSide, type FeedSource } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { addEntryFields } from "$stores/entries";
  import { convertAmountToBottle, convertAmountToBreast } from "$stores/feeds";
  import type { Timestamp } from "@firebase/firestore";
  import type { ZodError } from "zod";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";

  export let babyId: string;
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
      await updateFeed(db, babyId, update);
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
        ? {
            amount: convertAmountToBottle(update.amount),
            side: null,
            source,
          }
        : {
            amount: convertAmountToBreast(update.amount, update.timestamp),
            side: entry.side || "L",
            source,
          },
    );

    await handleUpdate();
  };

  const handleSide = async (e: CustomEvent<FeedSide | null>) => {
    setUpdate({ side: e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Timestamp>) => {
    setUpdate({ timestamp: e.detail });

    await handleUpdate();
  };

  const handleRemove = async () => {
    loading = true;

    try {
      await removeFeed(db, babyId, entry.id);
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
      <TimeRangePicker
        on:change={handleBreastAmount}
        start={update.amount.start}
        end={update.amount.end}
      />
    {:else}
      🚫 unknown source
    {/if}
  </article>

  <article class="source-input">
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
  .source-input {
    margin: 0.25rem 0;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
