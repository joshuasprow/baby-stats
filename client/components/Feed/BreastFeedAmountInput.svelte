<script lang="ts">
  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import type { TimeRangeAmount } from "baby-stats-models/entries";
  import { createEventDispatcher } from "svelte";

  export let amount: TimeRangeAmount;
  export let loading: boolean;

  const dispatch = createEventDispatcher<{ change: TimeRangeAmount }>();

  const handleChange = (e: CustomEvent<TimeRangeAmount>) =>
    dispatch("change", e.detail);
</script>

<TimeRangePicker
  {loading}
  on:change={handleChange}
  start={amount.start}
  end={amount.end}
/>
