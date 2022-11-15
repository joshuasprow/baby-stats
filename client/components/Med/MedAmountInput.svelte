<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InputEvent } from "../../lib/dom";

  export let amount = 2;
  export let loading: boolean;

  const dispatch = createEventDispatcher<{ change: number }>();

  const handleAmountChange = (e: InputEvent) => {
    const value = parseInt(e.currentTarget.value);

    if (typeof value !== "number") {
      console.error("invalid amount", value, typeof value);
      return;
    }

    amount = value;

    dispatch("change", amount);
  };
</script>

<label for="amount">
  amount:
  <input class:loading on:change={handleAmountChange} type="number" />
</label>

<style>
  .loading {
    filter: grayscale(100%);
    cursor: not-allowed;
  }
</style>
