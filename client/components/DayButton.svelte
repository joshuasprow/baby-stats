<script lang="ts">
  import { fade } from "svelte/transition";

  export let label: string;
</script>

<button transition:fade>{label}</button>

<style>
  button {
    background: transparent;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #888;
    padding: 0 0.25rem;
    margin-bottom: 0.5rem;
    border: 1px solid #888;
    border-radius: 0.25rem;
  }
</style>
