<script lang="ts">
  import { pickerDate, pickerDateString } from "$stores/picker-date";
  import type { InputEvent } from "../lib/types";

  const setPickerDate = (e: InputEvent) => {
    const [year, month, date] = e.currentTarget.value.split("-").map(Number);

    pickerDate.set({ year, month: month - 1, date });
  };
</script>

<span>date:</span>
<input on:change={setPickerDate} type="date" value={$pickerDateString} />

<style>
  span {
    display: block;
    text-decoration: underline;
  }

  input {
    margin-bottom: 1rem;
  }
</style>
