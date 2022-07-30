<script lang="ts">
  export let amount = 2;

  const set = (a: number) => {
    amount = a;
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
