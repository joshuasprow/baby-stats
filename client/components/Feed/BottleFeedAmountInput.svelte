<script lang="ts">
  import type { SelectEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher } from "svelte";

  export let amount: number;
  export let loading = false;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: options = [1, 2, 3, 4, 5].map((v) => ({
    label: `${v}`,
    value: v,
  }));

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
  <select disabled={loading} on:change={handleChange} value={amount}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  oz
</label>
