<script lang="ts">
  import { getDateString, getDateFromString } from "baby-stats-lib/dates";
  import type { ChangeEvent, InputEvent } from "baby-stats-lib/dom";
  import { createEventDispatcher } from "svelte";

  export let loading = false;
  export let date = new Date();

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleDateChange = (e: InputEvent | ChangeEvent) => {
    date = getDateFromString(e.currentTarget.value);

    dispatch("change", date);
  };
</script>

<input
  disabled={loading}
  on:change={handleDateChange}
  on:input={handleDateChange}
  type="date"
  value={getDateString(date)}
/>
