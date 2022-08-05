<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let loading = false;

  export let amount: number;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: {
    dispatch("change", amount);
  }
</script>

<label for="amount">
  amount:
  <input
    id="amount"
    bind:value={amount}
    disabled={loading}
    type="number"
    min={0.5}
    max={6}
    step={0.5}
  />
</label>
