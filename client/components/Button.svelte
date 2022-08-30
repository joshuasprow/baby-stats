<script lang="ts">
  import { fade } from "svelte/transition";

  export let disabled = false;
  export let label = "";
</script>

<button
  aria-disabled={disabled}
  class={$$props.class}
  {disabled}
  on:click
  transition:fade
>
  {label}
  <slot />
</button>

<style>
  button {
    background-color: var(--button-color);
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--button-font-color);
    padding: 0.1rem 0.25rem;
    border: var(--border);
    border-radius: var(--border-radius);
    transition-duration: 0.25s;
    transition-property: background-color, border-color;
  }

  button:hover {
    background-color: var(--button-color-hover);
    border-color: var(--border-color-hover);
  }

  button:active {
    background-color: var(--button-color-active);
    border-color: var(--border-color-active);
  }
</style>
