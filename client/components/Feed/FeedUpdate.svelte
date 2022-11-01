<script lang="ts">
  import {
    Feed,
    type FeedSide,
    type FeedSource,
  } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { updateEntry } from "../../firebase/entries";
  import { removeFeed } from "../../firebase/feeds";
  import { parseError } from "../../lib/error";
  import { addEntryFields } from "../../stores/entries";
  import {
    convertAmountToBottle,
    convertAmountToBreast,
  } from "../../stores/feeds";
  import EntryUpdateModal from "../Entry/EntryUpdateModal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedSideInputGroup from "./FeedSideInputGroup.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let entry: Feed;

  let error: null | string = null;
  let loading = false;

  let update = { ...entry };

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
      await updateEntry(db, update);
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
      await removeFeed(db, entry.babyId, entry.id);
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
