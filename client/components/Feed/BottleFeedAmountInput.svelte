<script lang="ts">
  import type { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import logger from "../../lib/logger";
  import type { SelectEvent } from "../../lib/dom";
  import DateTimePicker from "../DateTimePicker.svelte";

  export let amount: number;
  export let loading: boolean;
  export let timestamp: Timestamp;

  const dispatch = createEventDispatcher<{
    amount: number;
    timestamp: Timestamp;
  }>();

  $: options = [...Array(8).keys()].map((v) => {
    const a = v + 1;
    return {
      label: `${a}oz`,
      value: a,
    };
  });

  const handleAmountChange = (e: SelectEvent) => {
    const value = parseInt(e.currentTarget.value);

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
  }
</style>
