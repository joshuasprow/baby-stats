<script lang="ts" context="module">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import { addEntryFields } from "$stores/entries";
  import { addNap } from "$stores/naps";
  import { parseError } from "baby-stats-lib/error";
  import type { TimeRangeAmount } from "baby-stats-models/time-ranges";
  import { NapAdd } from "baby-stats-models/naps";

  const getDefaultAdd = (): NapAdd => {
    const timestamp = new Date();

    const start = new Date(timestamp);
    const end = new Date(timestamp);
    end.setMinutes(end.getMinutes() + 30);

    return {
      amount: { start, end },
      kind: "naps",
      timestamp,
    };
  };
</script>

<script lang="ts">
  let add: NapAdd = getDefaultAdd();

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<NapAdd>) => {
    const [a, e] = addEntryFields(NapAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => {
    const { amount, timestamp } = getDefaultAdd();

    setAdd({ amount, timestamp });
  };

  const handleAmount = (e: CustomEvent<TimeRangeAmount>) =>
    setAdd({ amount: e.detail, timestamp: e.detail.start });

  const handleAdd = async () => {
    loading = true;

    try {
      await addNap(add);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd} on:open={handleOpen}>
  <span slot="icon">💤</span>

  <article>
    <TimeRangePicker
      start={add.amount.start}
      end={add.amount.end}
      on:change={handleAmount}
    />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryAddModal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
