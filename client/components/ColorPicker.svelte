<script context="module" lang="ts">
  let count = 0;

  const getId = () => {
    count += 1;
    return `color-picker-${count}`;
  };
</script>

<script lang="ts">
  import { theme } from "$stores/theme";
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { hexToHsl, hslToHex } from "baby-stats-lib/theme";
  import type { Theme, ThemeElement } from "models/theme";
  import { createEventDispatcher } from "svelte";

  type E = $$Generic<ThemeElement>;

  export let element: E;

  let id = getId();
  $: hex = hslToHex($theme[element]);

  const dispatch = createEventDispatcher<{
    change: { element: E; value: Theme[E] };
  }>();

  const handleChange = (e: ChangeEvent) => {
    dispatch("change", {
      element,
      value: hexToHsl(e.currentTarget.value),
    });
  };
</script>

<label for={id}>
  {element}
  <input
    class="color-input"
    {id}
    type="color"
    on:change={handleChange}
    on:input={handleChange}
    value={hex}
  />
</label>

<style>
  label {
    display: grid;
    grid-template-columns: 6rem 6rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  input {
    -webkit-appearance: none;
    background: var(--button-color);
    padding: 0;
    border: none;
    border-radius: var(--border-radius);
    transition-duration: 0.25s;
    transition-property: background-color, border-color;
    width: 100%;
    height: 1.5rem;
  }

  input.color-input::-webkit-color-swatch {
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
  }

  input:hover {
    background-color: var(--button-color-hover);
    border-color: var(--border-color-hover);
  }

  input:active {
    background-color: var(--button-color-active);
    border-color: var(--border-color-active);
  }

  input::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input::-webkit-color-swatch {
    border: none;
  }
</style>
