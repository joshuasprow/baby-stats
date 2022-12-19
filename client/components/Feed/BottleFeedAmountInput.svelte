<script context="module" lang="ts">
  import type { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import type { SelectEvent } from "../../lib/dom";
  import logger from "../../lib/logger";
  import DateTimePicker from "../DateTimePicker.svelte";

  const options = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8,
  ].map((v) => ({
    label: `${v.toFixed(1)}oz`,
    value: v,
  }));
</script>

<script lang="ts">
  export let amount: number;
  export let loading: boolean;
  export let timestamp: Timestamp;

  const dispatch = createEventDispatcher<{
    amount: number;
    timestamp: Timestamp;
  }>();

  const handleAmountChange = (e: SelectEvent) => {
    const value = parseFloat(e.currentTarget.value);

    if (typeof value !== "number") {
      logger.error(new Error(`invalid amount: ${value} (${typeof value})`));
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

<label for="amount">amount:</label>
<select disabled={loading} on:change={handleAmountChange} value={amount}>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  select {
    border: var(--border);
    border-radius: var(--border-radius);
    width: 100%;
  }
</style>
