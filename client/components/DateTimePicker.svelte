<script lang="ts">
  import {
    getDateAndTimeStrings,
    getDateFromStrings,
  } from "baby-stats-lib/dates";
  import type { ChangeEvent, InputEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher } from "svelte";

  export let loading = false;
  export let timestamp = new Date();

  let { date, time } = getDateAndTimeStrings(timestamp);

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleDateChange = (e: InputEvent | ChangeEvent) =>
    dispatch(
      "change",
      getDateFromStrings({ date: e.currentTarget.value, time })
    );

  const handleTimeChange = (e: InputEvent | ChangeEvent) =>
    dispatch(
      "change",
      getDateFromStrings({ date, time: e.currentTarget.value })
    );
</script>

<div>
  <input
    disabled={loading}
    on:change={handleDateChange}
    on:input={handleDateChange}
    type="date"
    value={date}
  />
  <input
    disabled={loading}
    on:change={handleTimeChange}
    on:input={handleTimeChange}
    type="time"
    value={time}
  />
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>
