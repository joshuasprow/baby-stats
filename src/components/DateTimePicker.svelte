<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ChangeEvent, InputEvent } from "$lib/dom";
  import { getDateAndTimeStrings, getDateFromStrings } from "$lib/dates";

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
    on:change={handleDateChange}
    on:input={handleDateChange}
    type="date"
    value={date}
  />
  <input
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
