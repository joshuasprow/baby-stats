<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SelectEvent } from "../../lib/dom";

  export let amount: number;
  export let loading: boolean;

  const dispatch = createEventDispatcher<{ change: number }>();

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => ({
    label: `${v * 15}`,
    value: v,
  }));

  const handleChange = (e: SelectEvent) => {
    const _amount = parseInt(e.currentTarget.value);

    if (typeof _amount !== "number") {
      console.error("invalid amount", _amount, typeof _amount);
      return;
    }

    amount = _amount;

    dispatch("change", _amount);
  };
</script>

<label for="amount">
  amount:
  <select disabled={loading} on:change={handleChange}>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  minutes
</label>
