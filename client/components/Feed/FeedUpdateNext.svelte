<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import {
    Feed,
    type FeedSide,
    type FeedSource,
  } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import {
    convertAmountToBottle,
    convertAmountToBreast,
  } from "../../lib/feeds";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import Modal from "../Modal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedSideInputGroup from "./FeedSideInputGroup.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let entry: Feed;

  let error: null | string = null;
  let loading = false;
  let open = false;

  let update = { ...entry };

  const reset = () => {
    error = null;
    loading = false;
    open = false;

    update = { ...entry };
  };

  const setUpdate = (fields: Partial<Feed>) => {
    const [u, e] = mergeEntryFields(Feed, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateEntry(db, update);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
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
    try {
      loading = true;

      await removeEntry(db, entry.id);

      reset();
    } catch (e) {
      const parsed = parseError(e);

      error = parsed.message;
      loading = false;

      logger.error(parsed);
    }
  };
</script>

<Button on:click={handleOpen}>
  <FeedIcon amount={update.amount} source={update.source} side={update.side} />
</Button>

<Modal {loading} {open} on:close={handleClose}>
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

  <Button {loading} on:click={handleRemove} --width="100%">remove</Button>
</Modal>

<style>
  .source-input {
    margin: 0.25rem 0;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
