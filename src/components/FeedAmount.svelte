<script lang="ts">
  export let amount: number;
</script>

<label for="amount">
  amount:
  <input
    id="amount"
    bind:value={amount}
    type="number"
    min={0.5}
    max={6}
    step={0.5}
  />
</label>
