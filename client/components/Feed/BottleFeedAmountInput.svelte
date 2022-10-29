<script lang="ts">
  import type { SelectEvent } from "@baby-stats/lib/dom";
  import type { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import DateTimePicker from "../DateTimePicker.svelte";

  export let amount: number;
  export let loading: boolean;
  export let timestamp: Timestamp;

  const dispatch = createEventDispatcher<{
    amount: number;
    timestamp: Timestamp;
  }>();

  $: options = [1, 2, 3, 4, 5].map((v) => ({
    label: `${v}`,
    value: v,
  }));

  const handleAmountChange = (e: SelectEvent) => {
    const value = parseInt(e.currentTarget.value);

    if (typeof value !== "number") {
      console.error("invalid amount", value, typeof value);
      return;
    }

    amount = value;

    dispatch("amount", amount);
  };

  const handleTimestampChange = (e: CustomEvent<Timestamp>) => {
    timestamp = e.detail;

    dispatch("timestamp", timestamp);
  };
</script>

<DateTimePicker on:change={handleTimestampChange} {timestamp} />

<label for="amount">
  amount:
  <select disabled={loading} on:change={handleAmountChange} value={amount}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  oz
</label>

<style>
  label {
    display: block;
    margin: 0.25rem 0 0.25rem auto;
  }

  select {
    border: var(--border);
    border-radius: var(--border-radius);
  }
</style>
