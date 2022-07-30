<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { PeeAmount } from "$stores/pees";

  export let amount: PeeAmount = 2;

  const dispatch = createEventDispatcher<{ change: PeeAmount }>();

  const set = (a: PeeAmount) => {
    amount = a;
    dispatch("change", amount);
  };
</script>

<label for="amount">
  amount:
  <span class:active={amount >= 1} on:click={() => set(1)}>💧</span>
  <span class:active={amount >= 2} on:click={() => set(2)}>💧</span>
  <span class:active={amount === 3} on:click={() => set(3)}>💧</span>
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
</style>
