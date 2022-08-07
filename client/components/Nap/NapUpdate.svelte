<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import NapAmountInput from "$components/Nap/NapAmountInput.svelte";
  import NapIcon from "$components/Nap/NapIcon.svelte";
  import { addEntryFields } from "$stores/entries";
  import { removeNap, updateNap } from "$stores/naps";
  import { parseError } from "baby-stats-lib/error";
  import { Nap } from "baby-stats-models/naps";

  export let entry: Nap;

  let update: Nap = {
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

  const setUpdate = (fields: Partial<Nap>) => {
    const [u, e] = addEntryFields(Nap, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleAmount = async (e: CustomEvent<number>) => {
    setUpdate({ amount: e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    setUpdate({ timestamp: e.detail });

    await handleUpdate();
  };

  const handleRemove = () => removeNap(entry.id);
</script>

<EntryUpdateModal
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  timestamp={update.timestamp}
>
  <NapIcon amount={update.amount} slot="icon" />

  <article>
    <NapAmountInput amount={update.amount} {loading} on:change={handleAmount} />
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
