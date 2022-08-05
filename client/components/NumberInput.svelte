<script lang="ts">
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher, onMount } from "svelte";

  export let disabled: boolean;
  export let id: string;
  export let value: number;
  export let min: number;
  export let max: number;
  export let step: number;

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher<{ change: number }>();

  const handleChange = (event: ChangeEvent) => {
    const value = parseInt(event.currentTarget.value);

    if (isNaN(value) || typeof value !== "number") {
      console.error("invalid amount", value, typeof value);
      return;
    }

    dispatch("change", value);
  };

  const handleClick = () => {
    input.select();
  };
</script>

<input
  bind:value
  {disabled}
  {id}
  type="number"
  {min}
  {max}
  on:change={handleChange}
  on:click={handleClick}
  {step}
  bind:this={input}
/>
