<script lang="ts">
  import type { Time } from "@baby-stats/lib/dates";
  import { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import TimePicker from "./TimePicker.svelte";

  export let timestamp = Timestamp.now();

  let date = timestamp.toDate();
  let time: Time = { hours: date.getHours(), minutes: date.getMinutes() };

  const dispatch = createEventDispatcher<{ change: Timestamp }>();

  const handleDateChange = (e: CustomEvent<Date>) => {
    date = e.detail;

    const d = new Date(date);
    d.setHours(time.hours);
    d.setMinutes(time.minutes);

    dispatch("change", Timestamp.fromDate(d));
  };

  const handleTimeChange = (e: CustomEvent<Time>) => {
    time = e.detail;

    const d = new Date(date);
    d.setHours(time.hours);
    d.setMinutes(time.minutes);

    dispatch("change", Timestamp.fromDate(d));
  };
</script>

<div>
  <DatePicker on:change={handleDateChange} {date} />
  <TimePicker on:change={handleTimeChange} {time} />
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.25rem;
    justify-content: flex-start;
  }
</style>
