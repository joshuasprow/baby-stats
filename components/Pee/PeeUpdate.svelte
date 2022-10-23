<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import PeeIcon from "$components/Pee/PeeIcon.svelte";
  import { db } from "$firebase/app";
  import { removePee, updatePee } from "$firebase/pees";
  import { parseError } from "$lib/error";
  import { Pee, type PeeAmount } from "$models/pees";
  import { addEntryFields } from "$stores/entries";
  import type { Timestamp } from "@firebase/firestore";

  export let entry: Pee;
  export let babyId: string;

  let update: Pee = {
    id: entry.id,
    amount: entry.amount,
    kind: "pees",
    timestamp: entry.timestamp,
  };

  let error: null | string = null;
  let loading = false;

  const handleUpdate = async () => {
    loading = true;

    try {
      await updatePee(db, babyId, update);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };

  const setUpdate = (fields: Partial<Pee>) => {
    const [u, e] = addEntryFields(Pee, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleAmount = async (e: CustomEvent<PeeAmount>) => {
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
      await removePee(db, babyId, entry.id);
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
  <PeeIcon amount={update.amount} slot="icon" />

  <article>
    <PeeAmountInput amount={update.amount} {loading} on:change={handleAmount} />
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
