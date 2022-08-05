<script lang="ts">
  import type { SelectEvent } from "baby-stats-lib/dom";
  import type { FeedSource } from "baby-stats-models/feeds";
  import { createEventDispatcher } from "svelte";

  export let loading = false;

  export let amount: number;
  export let source: FeedSource;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: {
    dispatch("change", amount);
  }

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
    label: `${v * 5}`,
    value: v,
  }));

  const handleChange = (event: SelectEvent) => {
    const value = parseInt(event.currentTarget.value);
    if (typeof value !== "number") {
      console.error("invalid amount", value, typeof value);
      return;
    }
    amount = value;
  };
</script>

<label for="amount">
  amount:
  <!-- TODO: make amount in minutes for breast; oz for bottle -->
  {#if source === "bottle"}
    <input
      id="amount"
      bind:value={amount}
      disabled={loading}
      type="number"
      min={0.5}
      max={6}
      step={0.5}
    />
    oz
  {:else if source === "breast"}
    <select on:change={handleChange}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    minutes
  {:else}
    Invalid source: {source}
  {/if}
</label>
