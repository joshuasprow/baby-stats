<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { addFeed } from "$stores/feeds";
  import { parseError } from "baby-stats-lib/error";
  import type { TimeRangeAmount } from "baby-stats-models/entries";
  import {
    FeedAdd,
    type FeedSide,
    type FeedSource,
  } from "baby-stats-models/feeds";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import BreastFeedAmountInput from "./BreastFeedAmountInput.svelte";

  let add: FeedAdd = {
    amount: 2,
    kind: "feeds",
    side: null,
    source: "bottle",
    timestamp: new Date(),
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

  const handleOpen = () => setAdd({ timestamp: new Date() });

  const handleAmount = (e: CustomEvent<number | TimeRangeAmount>) =>
    setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Date>) =>
    setAdd({ timestamp: e.detail });

  const handleSource = (e: CustomEvent<FeedSource>) => {
    const source = e.detail;

    setAdd(
      source === "bottle"
        ? { side: null, source }
        : { side: add.side || "L", source }
    );
  };

  const handleSide = (e: CustomEvent<FeedSide | null>) =>
    setAdd({ side: e.detail });

  const handleAdd = async () => {
    loading = true;

    try {
      await addFeed(add);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd} on:open={handleOpen}>
  <span slot="icon">🍼</span>

  <article>
    {#if add.source === "bottle"}
      <BottleFeedAmountInput
        amount={add.amount}
        {loading}
        on:amount={handleAmount}
        on:timestamp={handleTimestamp}
        timestamp={add.timestamp}
      />
    {:else if add.source === "breast"}
      <BreastFeedAmountInput
        amount={add.amount}
        {loading}
        on:amount={handleAmount}
        on:timestamp={handleTimestamp}
        timestamp={add.timestamp}
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
