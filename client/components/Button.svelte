<script lang="ts">
  import { fade } from "svelte/transition";

  export let disabled = false;
  export let label = "";
</script>

<button aria-disabled={disabled} {disabled} on:click transition:fade>
  {label}
  <slot />
</button>

<style>
  button {
    --border-color: #888;

    background: transparent;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #666;
    padding: 0.1rem 0.25rem;
    margin-bottom: 0.5rem;
    border: var(--border);

    border-radius: var(--border-radius);
    border-color: var(--border-color);

    transition-duration: 0.25s;
    transition-property: background, border-color;
    transition-timing-function: ease-in;
  }

  button:hover {
    --border-color: #666;

    background: rgba(0, 0, 0, 0.1);
  }

  button:active {
    --border-color: #666;

    background: rgba(0, 0, 0, 0.2);
  }
</style>
