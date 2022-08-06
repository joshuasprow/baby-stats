<script lang="ts">
  import type { Time } from "baby-stats-lib/dates";
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import TimePicker from "./TimePicker.svelte";

  export let loading = false;
  export let timestamp = new Date();

  let date = new Date(timestamp);

  let startTime: Time = { hours: date.getHours(), minutes: date.getMinutes() };
  let endTime: Time = { ...startTime };

  const dispatch = createEventDispatcher<{
    change: { start: Date; end: Date };
  }>();

  const dispatchChange = () => {
    const start = new Date(date);
    start.setHours(startTime.hours);
    start.setMinutes(startTime.minutes);

    const end = new Date(date);
    end.setHours(endTime.hours);
    end.setMinutes(endTime.minutes);

    dispatch("change", { start, end });
  };

  const handleDateChange = (e: CustomEvent<Date>) => {
    date = e.detail;

    dispatchChange();
  };

  const handleStartTimeChange = (e: CustomEvent<Time>) => {
    startTime = e.detail;

    dispatchChange();
  };

  const handleEndTimeChange = (e: CustomEvent<Time>) => {
    endTime = e.detail;

    dispatchChange();
  };
</script>

<div>
  <DatePicker {loading} on:change={handleDateChange} {date} />
  <TimePicker {loading} on:change={handleStartTimeChange} time={startTime} />
  <TimePicker {loading} on:change={handleEndTimeChange} time={endTime} />
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>
