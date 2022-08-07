<script lang="ts" context="module">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";
  import { addFeed } from "$stores/feeds";
  import {
    BottleFeed,
    BreastFeed,
    Feed,
    type BreastFeedAmount,
    type FeedAdd,
  } from "baby-stats-models/feeds";
  import type { ZodError, ZodType } from "zod";
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import BreastFeedAmountInput from "./BreastFeedAmountInput.svelte";

  const parse = <F extends BreastFeed | Feed>(
    type: ZodType<F>,
    feed: F
  ): [F, null] | [null, ZodError<F>] => {
    try {
      return [type.parse(feed), null];
    } catch (error) {
      return [null, error as ZodError<F>];
    }
  };

  const addFields = <F extends BreastFeed | Feed>(
    type: ZodType<F>,
    feed: F,
    fields: { [key in keyof F]?: F[key] }
  ) => parse(type, { ...feed, ...fields });
</script>

<script lang="ts">
  let add: FeedAdd = {
    amount: 2,
    kind: "feeds",
    side: null,
    source: "bottle",
    timestamp: new Date(),
  };

  let error: null | string = null;
  let loading = false;

  const setBreastAdd = (fields: {
    [key in keyof BreastFeed]?: BreastFeed[key];
  }) => {
    const [a, e] = addFields(BreastFeed, add as BreastFeed, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const setBottleAdd = (fields: {
    [key in keyof BottleFeed]?: BottleFeed[key];
  }) => {
    const [a, e] = addFields(BottleFeed, add as BottleFeed, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  $: if (add.source === "bottle") {
    setBottleAdd({ side: null });
  }
  $: if (add.source === "breast" && add.side === null) {
    setBreastAdd({ side: "L" });
  }

  const handleAmount = (e: CustomEvent<number | BreastFeedAmount>) => {
    add = Feed.parse({ ...add, amount: e.detail });
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    add.timestamp = e.detail;
  };

  const handleAdd = async () => {
    loading = true;

    await addFeed(add);

    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd}>
  <span slot="icon">🍼</span>

  <article>
    {#if add.source === "bottle"}
      <BottleFeedAmountInput
        amount={add.amount}
        {loading}
        on:amount={handleAmount}
        timestamp={add.timestamp}
        on:timestamp={handleTimestamp}
      />
    {:else if add.source === "breast"}
      <BreastFeedAmountInput
        amount={add.amount}
        {loading}
        on:change={handleAmount}
        timestamp={add.timestamp}
      />
      <FeedSideInputGroup disabled={loading} side={add.side} />
    {/if}
  </article>

  <article>
    source:
    <FeedSourceInput source={add.source} />
  </article>
</EntryAddModal>
