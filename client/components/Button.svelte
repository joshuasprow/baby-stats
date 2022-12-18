<script lang="ts">
  import { fade } from "svelte/transition";

  interface $$Props {
    class?: string;
    disabled?: boolean;
    label?: string;
    loading?: boolean;

    "--width"?: string;
  }

  export let disabled = false;
  export let label = "";
  export let loading = false;

  $: _disabled = disabled || loading;
</script>

<button
  aria-disabled={_disabled}
  class={$$props.class}
  disabled={_disabled}
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
    justify-content: center;
    font-weight: 700;
    color: var(--button-font-color);
    padding: 0.1rem 0.25rem;
    border: var(--border);
    border-radius: var(--border-radius);
    transition-duration: 0.25s;
    transition-property: background-color, border-color;
    width: var(--width, auto);
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
