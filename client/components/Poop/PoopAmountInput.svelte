<script lang="ts">
  import type { PoopAmount } from "baby-stats-models/poops";
  import { createEventDispatcher } from "svelte";

  export let amount: PoopAmount = 2;
  export let loading = false;

  const dispatch = createEventDispatcher<{ change: PoopAmount }>();

  const set = (a: PoopAmount) => {
    amount = a;
    dispatch("change", amount);
  };
</script>

<label for="amount">
  amount:
  <span class:active={amount >= 1} class:loading on:click={() => set(1)}>
    💩
  </span>
  <span class:active={amount >= 2} class:loading on:click={() => set(2)}>
    💩
  </span>
  <span class:active={amount === 3} class:loading on:click={() => set(3)}>
    💩
  </span>
</label>

<style>
  span {
    filter: grayscale(100%);
    cursor: pointer;
    transition: filter 100ms ease-in-out;
  }

  .active {
    filter: grayscale(0%);
  }

  .loading {
    filter: grayscale(100%);
    cursor: not-allowed;
  }
</style>
