<script lang="ts" context="module">
  import type { SelectEvent } from "baby-stats-lib/dom";
  import type { BreastFeedAmount, FeedSource } from "baby-stats-models/feeds";
  import { createEventDispatcher } from "svelte";

  type Amount<S extends FeedSource> = S extends "bottle"
    ? number
    : BreastFeedAmount;

  type Timestamp<S extends FeedSource> = S extends "bottle" ? Date : never;
</script>

<script lang="ts">
  import BottleFeedAmountInput from "./BottleFeedAmountInput.svelte";
  import BreastFeedAmountInput from "./BreastFeedAmountInput.svelte";

  type S = $$Generic<FeedSource>;

  export let amount: Amount<S>;
  export let loading: boolean;
  export let source: S;
  export let timestamp: Timestamp<S>;

  const dispatch = createEventDispatcher<{ change: Amount<S> }>();

  const handleBottleChange = (e: CustomEvent<number>) =>
    dispatch("change", e.detail as Amount<S>);

  const handleBreastChange = (e: CustomEvent<BreastFeedAmount>) =>
    dispatch("change", e.detail as Amount<S>);
</script>

{#if source === "bottle"}
  {#if typeof amount === "number"}
    <BottleFeedAmountInput {amount} {loading} on:change={handleBottleChange} />
  {:else}
    🚫 amount should be a number
  {/if}
{:else}
  <BreastFeedAmountInput
    {amount}
    {loading}
    on:change={handleBreastChange}
    {timestamp}
  />
{/if}
