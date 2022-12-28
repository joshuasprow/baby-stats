<script context="module" lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { ENTRY_ICONS } from "@baby-stats/models/entries-base";
  import {
    FeedAdd,
    type FeedSide,
    type FeedSource,
  } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
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
  import FeedSideInputGroup from "./FeedSideInputGroup.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  const defaultAdd = ({
    babyId,
    userId,
  }: Pick<FeedAdd, "babyId" | "userId">): FeedAdd => ({
    babyId,
    userId,
    amount: 4,
    kind: "feeds",
    side: null,
    source: "bottle",
    timestamp: Timestamp.now(),
  });
</script>

<script lang="ts">
  export let babyId: string;
  export let userId: string;

  let add = defaultAdd({ babyId, userId });

  let error: null | string = null;
  let loading = false;
  let open = false;

  const reset = () => {
    add = defaultAdd({ babyId, userId });
    error = null;
    loading = false;
    open = false;
  };

  const setAdd = (fields: Partial<FeedAdd>) => {
    const [a, e] = mergeEntryFields(FeedAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => {
    open = true;
    setAdd({ timestamp: Timestamp.now() });
  };

  const handleClose = () => {
    reset();
  };

  const handleBottleAmount = (e: CustomEvent<number>) => {
    if (add.source === "breast") return;

    setAdd({ amount: e.detail });
  };

  const handleBreastAmount = (e: CustomEvent<TimeRangeAmount>) => {
    if (add.source === "bottle") return;

    const amount = e.detail;

    setAdd({ amount: { ...amount }, timestamp: amount.start });
  };

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    setAdd({ timestamp: e.detail });

  const handleSource = (e: CustomEvent<FeedSource>) => {
    const source = e.detail;

    setAdd(
      source === "bottle"
        ? {
            amount: convertAmountToBottle(add.amount),
            side: null,
            source,
          }
        : {
            amount: convertAmountToBreast(add.amount, add.timestamp),
            side: add.side || "L",
            source,
          },
    );
  };

  const handleSide = (e: CustomEvent<FeedSide | null>) =>
    setAdd({ side: e.detail });

  const handleAdd = async () => {
    try {
      loading = true;

      await addEntry(db, add);

      reset();
    } catch (e) {
      const parsed = parseError(e);

      error = parsed.message;
      loading = false;

      logger.error(parsed);
    }
  };
</script>

<Button disabled={loading} on:click={handleOpen}>
  <span class="shadowed">{ENTRY_ICONS.feeds.bottle}</span>
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    {#if add.source === "bottle"}
      <BottleFeedAmountInput
        amount={add.amount}
        {loading}
        on:amount={handleBottleAmount}
        on:timestamp={handleTimestamp}
        timestamp={add.timestamp}
      />
    {:else if add.source === "breast"}
      <TimeRangePicker
        on:change={handleBreastAmount}
        start={add.amount.start}
        end={add.amount.end}
      />
    {:else}
      🚫 unknown source
    {/if}
  </article>

  <article>
    source:
    <FeedSourceInput {loading} on:change={handleSource} source={add.source} />
  </article>

  {#if add.source === "breast"}
    <article>
      <FeedSideInputGroup {loading} on:change={handleSide} side={add.side} />
    </article>
  {/if}

  {#if error}
    <span class="error">{error}</span>
  {/if}

  <Button {loading} on:click={handleAdd} --width="100%">add</Button>
</Modal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
