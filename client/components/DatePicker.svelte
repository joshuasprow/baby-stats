<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getDateFromString, getDateString } from "../lib/dates";
  import type { ChangeEvent, InputEvent } from "../lib/dom";

  export let date = new Date();

  $: value = getDateString(date);

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleDateChange = (e: ChangeEvent) => {
    date = getDateFromString(e.currentTarget.value);
    dispatch("change", date);
  };

  const handleDateInput = (e: InputEvent) => {
    date = getDateFromString(e.currentTarget.value);
    dispatch("change", date);
  };
</script>

<input
  on:change={handleDateChange}
  on:input={handleDateInput}
  type="date"
  {value}
/>

<style>
  input {
    border: var(--border);
    border-radius: var(--border-radius);
  }
</style>
