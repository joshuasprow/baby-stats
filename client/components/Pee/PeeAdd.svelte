<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import { db } from "$firebase";
  import { addPee } from "$firebase/pees";
  import { parseError } from "$lib/error";
  import { PeeAdd, type PeeAmount } from "$models/pees";
  import { addEntryFields } from "$stores/entries";
  import { Timestamp } from "@firebase/firestore";

  export let babyId: string;

  let add: PeeAdd = {
    amount: 2,
    kind: "pees",
    timestamp: Timestamp.now(),
  };

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<PeeAdd>) => {
    const [a, e] = addEntryFields(PeeAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => setAdd({ timestamp: Timestamp.now() });

  const handleAmount = (e: CustomEvent<PeeAmount>) =>
    setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    setAdd({ timestamp: e.detail });

  const handleAdd = async () => {
    loading = true;

    try {
      await addPee(db, babyId, add);
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryAddModal
  {loading}
  on:add={handleAdd}
  on:open={handleOpen}
  on:timestamp={handleTimestamp}
  timestamp={add.timestamp}
>
  <span class="shadowed" slot="icon">💧</span>

  <article>
    <PeeAmountInput amount={add.amount} {loading} on:change={handleAmount} />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryAddModal>

<style>
  article {
    margin: 0.25rem 0;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
