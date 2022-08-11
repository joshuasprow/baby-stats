<script lang="ts">
  import { getDateString, getDateFromString } from "baby-stats-lib/dates";
  import type { ChangeEvent, InputEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher } from "svelte";

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
