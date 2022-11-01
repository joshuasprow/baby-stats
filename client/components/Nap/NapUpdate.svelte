<script lang="ts">
  import { Nap } from "@baby-stats/models/naps";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { db } from "../../firebase";
  import { updateEntry } from "../../firebase/entries";
  import { removeNap } from "../../firebase/naps";
  import { parseError } from "../../lib/error";
  import { addEntryFields } from "../../stores/entries";
  import EntryUpdateModal from "../Entry/EntryUpdateModal.svelte";
  import NapIcon from "../Nap/NapIcon.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";

  export let entry: Nap;

  let update: Nap = {
    id: entry.id,
    babyId: entry.babyId,
    userId: entry.userId,
    amount: entry.amount,
    kind: "naps",
    timestamp: entry.timestamp,
  };

  let error: null | string = null;
  let loading = false;

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateEntry(db, update);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };

  const setUpdate = (fields: Partial<Nap>) => {
    const [u, e] = addEntryFields(Nap, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleAmount = async (e: CustomEvent<TimeRangeAmount>) => {
    setUpdate({ amount: e.detail, timestamp: e.detail.start });

    await handleUpdate();
  };

  const handleRemove = async () => {
    loading = true;

    try {
      await removeNap(db, entry.babyId, entry.id);
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
