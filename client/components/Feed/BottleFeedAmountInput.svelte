<script lang="ts">
  import DateTimePicker from "$components/DateTimePicker.svelte";
  import type { Timestamp } from "baby-stats-firebase";
  import type { SelectEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher } from "svelte";

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
