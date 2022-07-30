<script lang="ts">
  import { pickerDate, pickerDateString } from "$stores/picker-date";

  const setDevDate = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const [year, month, date] = event.currentTarget.value
      .split("-")
      .map(Number);

    pickerDate.set({ year, month: month - 1, date });
  };
</script>

<span>date:</span>
<input on:change={setDevDate} type="date" value={$pickerDateString} />

<style>
  span {
    display: block;
    text-decoration: underline;
  }

  input {
    margin-bottom: 1rem;
  }
</style>
