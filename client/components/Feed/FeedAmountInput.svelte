<script lang="ts" context="module">
  import type { SelectEvent } from "baby-stats-lib/dom";
  import type { FeedSource } from "baby-stats-models/feeds";
  import { createEventDispatcher } from "svelte";

  const getUnit = (source: FeedSource) => {
    switch (source) {
      case "bottle":
        return "oz";
      case "breast":
        return "minutes";
      default:
        return "Error: invalid source";
    }
  };

  const getOptionLabel = (source: FeedSource, value: number) => {
    switch (source) {
      case "bottle":
        return `${value}`;
      case "breast":
        return `${value * 5}`;
      default:
        return "Error: invalid source";
    }
  };

  const getOptions = (source: FeedSource) => {
    switch (source) {
      case "bottle":
        return [1, 2, 3, 4, 5].map((v) => ({
          label: getOptionLabel(source, v),
          value: v,
        }));
      case "breast":
        return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
          label: getOptionLabel(source, v),
          value: v,
        }));
      default:
        return [];
    }
  };
</script>

<script lang="ts">
  export let loading = false;

  export let amount: number;
  export let source: FeedSource;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: options = getOptions(source);
  $: unit = getUnit(source);

  $: {
    dispatch("change", amount);
  }

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
  <select disabled={loading} on:change={handleChange} value={amount}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  {unit}
</label>
