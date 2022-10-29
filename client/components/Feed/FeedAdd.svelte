<script lang="ts">
  import {
    FeedAdd,
    type FeedSide,
    type FeedSource,
  } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addFeed } from "../../firebase/feeds";
  import { parseError } from "../../lib/error";
  import { addEntryFields } from "../../stores/entries";
  import {
    convertAmountToBottle,
    convertAmountToBreast,
  } from "../../stores/feeds";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import FeedSideInputGroup from "./FeedSideInputGroup.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  export let babyId: string;
  export let userId: string;

  let add: FeedAdd = {
    babyId,
    userId,
    amount: 2,
    kind: "feeds",
    side: null,
    source: "bottle",
    timestamp: Timestamp.now(),
  };

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<FeedAdd>) => {
    const [a, e] = addEntryFields(FeedAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => setAdd({ timestamp: Timestamp.now() });

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
    loading = true;

    try {
      await addFeed(db, babyId, add);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd} on:open={handleOpen}>
  <span class="shadowed" slot="icon">🍼</span>

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
</EntryAddModal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
