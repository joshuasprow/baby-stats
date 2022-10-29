<script lang="ts" context="module">
  import { createEventDispatcher } from "svelte";
  import { getTimeFromString, getTimeString, type Time } from "../lib/dates";
  import type { ChangeEvent, InputEvent } from "../lib/dom";

  const newTime = () => {
    const now = new Date();

    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
    };
  };
</script>

<script lang="ts">
  export let time: Time = newTime();

  $: value = getTimeString(time);

  const dispatch = createEventDispatcher<{ change: Time }>();

  const handleTimeChange = (e: ChangeEvent) => {
    time = getTimeFromString(e.currentTarget.value);
    dispatch("change", time);
  };

  const handleTimeInput = (e: InputEvent) => {
    time = getTimeFromString(e.currentTarget.value);
    dispatch("change", time);
  };
</script>

<input
  on:change={handleTimeChange}
  on:input={handleTimeInput}
  type="time"
  {value}
/>

<style>
  input {
    border: var(--border);
    border-radius: var(--border-radius);
  }
</style>
