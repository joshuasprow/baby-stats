<script lang="ts">
  import { Timestamp } from "baby-stats-firebase/types";
  import type { Time } from "baby-stats-lib/dates";
  import type { TimeRangeAmount } from "baby-stats-models/time";
  import { createEventDispatcher } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import TimePicker from "./TimePicker.svelte";

  export let start: Date;
  export let end: Date;

  let date = new Date(start);

  let startTime: Time = {
    hours: start.getHours(),
    minutes: start.getMinutes(),
  };
  let endTime: Time = {
    hours: end.getHours(),
    minutes: end.getMinutes(),
  };

  const timeIsLessThan = (a: Time, b: Time) => {
    if (a.hours < b.hours) return true;
    if (a.hours !== b.hours) return false;
    return a.minutes < b.minutes;
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
