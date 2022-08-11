<script lang="ts">
  import { Timestamp } from "baby-stats-firebase";
  import type { Time } from "baby-stats-lib/dates";
  import type { TimeRangeAmount } from "baby-stats-models/time";
  import { createEventDispatcher } from "svelte";
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

  // const timeIsLessThan = (a: Time, b: Time) => {
  //   if (a.hours < b.hours) return true;
  //   if (a.hours !== b.hours) return false;
  //   return a.minutes < b.minutes;
  // };

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

<DatePicker on:change={handleDateChange} {date} />
<TimePicker on:change={handleStartTimeChange} time={startTime} />

<div>
  <span>end time:</span>
  <TimePicker on:change={handleEndTimeChange} time={endTime} />
</div>

<style>
  div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  span {
    margin-right: 0.5rem;
  }
</style>
