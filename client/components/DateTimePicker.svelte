<script lang="ts">
  import type { Time } from "baby-stats-lib/dates";
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import TimePicker from "./TimePicker.svelte";

  export let loading = false;
  export let timestamp = new Date();

  let date = new Date(timestamp);
  let time: Time = { hours: date.getHours(), minutes: date.getMinutes() };

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleDateChange = (e: CustomEvent<Date>) => {
    date = e.detail;

    const d = new Date(date);
    d.setHours(time.hours);
    d.setMinutes(time.minutes);

    dispatch("change", d);
  };

  const handleTimeChange = (e: CustomEvent<Time>) => {
    time = e.detail;

    const d = new Date(date);
    d.setHours(time.hours);
    d.setMinutes(time.minutes);

    dispatch("change", d);
  };
</script>

<div>
  <DatePicker {loading} on:change={handleDateChange} {date} />
  <TimePicker {loading} on:change={handleTimeChange} {time} />
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>
