<script lang="ts">
  import type { PeeAmount } from "@baby-stats/models/pees";
  import { createEventDispatcher } from "svelte";

  export let amount: PeeAmount = 2;
  export let loading: boolean;

  const dispatch = createEventDispatcher<{ change: PeeAmount }>();

  const set = (a: PeeAmount) => {
    amount = a;
    dispatch("change", amount);
  };
</script>

<label for="amount">
  amount:
  <span
    class="shadowed"
    class:active={amount >= 1}
    class:loading
    on:click={() => set(1)}
    on:keypress={() => set(1)}
  >
    💧
  </span>
  <span
    class="shadowed"
    class:active={amount >= 2}
    class:loading
    on:click={() => set(2)}
    on:keypress={() => set(2)}
  >
    💧
  </span>
  <span
    class="shadowed"
    class:active={amount === 3}
    class:loading
    on:click={() => set(3)}
    on:keypress={() => set(3)}
  >
    💧
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
