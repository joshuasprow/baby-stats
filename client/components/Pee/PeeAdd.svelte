<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { addPee } from "$stores/pees";
  import { parseError } from "baby-stats-lib/error";
  import { PeeAdd, type PeeAmount } from "baby-stats-models/pees";

  let add: PeeAdd = {
    amount: 2,
    kind: "pees",
    timestamp: new Date(),
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

  const handleOpen = () => setAdd({ timestamp: new Date() });

  const handleAmount = (e: CustomEvent<PeeAmount>) =>
    setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Date>) =>
    setAdd({ timestamp: e.detail });

  const handleAdd = async () => {
    loading = true;

    try {
      await addPee(add);
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
  <span slot="icon">💧</span>

  <article>
    <PeeAmountInput amount={add.amount} {loading} on:change={handleAmount} />
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
