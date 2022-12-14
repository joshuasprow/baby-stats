<script lang="ts">
  import { Poop, type PoopAmount } from "@baby-stats/models/poops";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import logger from "../../lib/logger";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "@baby-stats/lib/error";
  import EntryUpdateModal from "../Entry/EntryUpdateModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";
  import PoopIcon from "./PoopIcon.svelte";

  export let entry: Poop;

  let update: Poop = {
    id: entry.id,
    babyId: entry.babyId,
    userId: entry.userId,
    amount: entry.amount,
    kind: "poops",
    timestamp: entry.timestamp,
  };

  let error: null | string = null;
  let loading = false;

  const setUpdate = (fields: Partial<Poop>) => {
    const [u, e] = mergeEntryFields(Poop, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateEntry(db, update);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
    }

    loading = false;
  };

  const handleAmount = async (e: CustomEvent<PoopAmount>) => {
    setUpdate({ amount: e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Timestamp>) => {
    setUpdate({ timestamp: e.detail });

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

<EntryUpdateModal
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  timestamp={update.timestamp}
>
  <PoopIcon amount={update.amount} slot="icon" />

  <article>
    <PoopAmountInput
      amount={update.amount}
      {loading}
      on:change={handleAmount}
    />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryUpdateModal>

<style>
  article {
    margin: 0.25rem 0;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
