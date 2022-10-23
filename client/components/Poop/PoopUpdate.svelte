<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import PoopAmountInput from "$components/Poop/PoopAmountInput.svelte";
  import PoopIcon from "$components/Poop/PoopIcon.svelte";
  import { addEntryFields } from "$stores/entries";
  import type { Timestamp } from "@firebase/firestore";
  import { removePoop, updatePoop } from "baby-stats-firebase/poops";
  import { parseError } from "baby-stats-lib/error";
  import { Poop, type PoopAmount } from "baby-stats-models/poops";
  import { db } from "../../firebase";

  export let entry: Poop;
  export let babyId: string;

  let update: Poop = {
    id: entry.id,
    amount: entry.amount,
    kind: "poops",
    timestamp: entry.timestamp,
  };

  let error: null | string = null;
  let loading = false;

  const setUpdate = (fields: Partial<Poop>) => {
    const [u, e] = addEntryFields(Poop, update, fields);
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
      await updatePoop(db, babyId, update);
    } catch (e) {
      error = parseError(e).message;
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
      await removePoop(db, babyId, entry.id);
    } catch (e) {
      error = parseError(e).message;
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
