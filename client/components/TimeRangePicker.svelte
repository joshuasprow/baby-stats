<script lang="ts">
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import type { Time } from "../lib/dates";
  import DatePicker from "./DatePicker.svelte";
  import TimePicker from "./TimePicker.svelte";

  export let start: Timestamp;
  export let end: Timestamp;

  let date = start.toDate();

  let startTime: Time = {
    hours: start.toDate().getHours(),
    minutes: start.toDate().getMinutes(),
  };

  let endTime: Time = {
    hours: end.toDate().getHours(),
    minutes: end.toDate().getMinutes(),
  };

  const dispatch = createEventDispatcher<{ change: TimeRangeAmount }>();

  const dispatchChange = () => {
    const s = new Date(date);
    s.setHours(startTime.hours);
    s.setMinutes(startTime.minutes);

    const e = new Date(date);
    e.setHours(endTime.hours);
    e.setMinutes(endTime.minutes);

    dispatch("change", {
      start: Timestamp.fromDate(s),
      end: Timestamp.fromDate(e),
    });
  };

  const handleDateChange = ({ detail }: CustomEvent<Date>) => {
    date = detail;

    dispatchChange();
  };

  const handleStartTimeChange = ({ detail }: CustomEvent<Time>) => {
    startTime = { ...detail };

    dispatchChange();
  };

  const handleEndTimeChange = ({ detail }: CustomEvent<Time>) => {
    endTime = { ...detail };

    dispatchChange();
  };
</script>

<article>
  <DatePicker on:change={handleDateChange} {date} />
  <TimePicker on:change={handleStartTimeChange} time={startTime} />

  <span>end time:</span>
  <TimePicker on:change={handleEndTimeChange} time={endTime} />
</article>

<style>
  article {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;
    row-gap: 0.25rem;
    column-gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  span {
    margin-left: auto;
  }
</style>
