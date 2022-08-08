<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import NapIcon from "$components/Nap/NapIcon.svelte";
  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import { addEntryFields } from "$stores/entries";
  import { removeNap, updateNap } from "$stores/naps";
  import { parseError } from "baby-stats-lib/error";
  import type { TimeRangeAmount } from "baby-stats-models/time-ranges";
  import { NapNext } from "baby-stats-models/naps";

  export let entry: NapNext;

  let update: NapNext = {
    id: entry.id,
    amount: entry.amount,
    kind: "naps",
    timestamp: entry.timestamp,
  };

  let error: null | string = null;
  let loading = false;

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateNap(update);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };

  const setUpdate = (fields: Partial<NapNext>) => {
    const [u, e] = addEntryFields(NapNext, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleAmount = async (e: CustomEvent<TimeRangeAmount>) => {
    setUpdate({ amount: e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    setUpdate({ timestamp: e.detail });

    await handleUpdate();
  };

  const handleRemove = async () => {
    loading = true;

    try {
      await removeNap(entry.id);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryUpdateModal {loading} on:remove={handleRemove}>
  <NapIcon amount={update.amount} slot="icon" />

  <article>
    <TimeRangePicker
      start={update.amount.start}
      end={update.amount.end}
      {loading}
      on:change={handleAmount}
    />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryUpdateModal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
