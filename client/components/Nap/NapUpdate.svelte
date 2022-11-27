<script lang="ts">
  import { Nap } from "@baby-stats/models/naps";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import logger from "../../firebase/logger";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "@baby-stats/lib/error";
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
    const [u, e] = mergeEntryFields(Nap, update, fields);
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
      await removeEntry(db, entry.id);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
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
