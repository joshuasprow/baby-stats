<script lang="ts">
  import type { ChangeEvent, SelectEvent } from "baby-stats-lib/dom";
  import type { FeedSource } from "baby-stats-models/feeds";
  import { createEventDispatcher } from "svelte";

  export let disabled: boolean;
  export let id: string;
  export let value: number;
  export let min: number;
  export let max: number;
  export let step: number;

  const dispatch = createEventDispatcher<{ change: number }>();

  const handleChange = (event: ChangeEvent) => {
    const value = parseInt(event.currentTarget.value);

    if (isNaN(value) || typeof value !== "number") {
      console.error("invalid amount", value, typeof value);
      return;
    }

    dispatch("change", value);
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
  {step}
/>
