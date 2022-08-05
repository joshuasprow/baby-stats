<script lang="ts">
  export let label: string;
  export let count: number;
</script>

<div>
  <span>{label}: {count}</span>
  <slot />
</div>

<style>
  span {
    display: block;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-right: 0.5rem;
  }
</style>
