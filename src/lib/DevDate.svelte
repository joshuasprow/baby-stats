<script lang="ts">
  import { devDate, devDateString } from "./dev-date";

  const setDevDate = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const [year, month, date] = event.currentTarget.value
      .split("-")
      .map(Number);

    devDate.set({ year, month: month - 1, date });
  };
</script>

<input on:change={setDevDate} type="date" value={$devDateString} />
