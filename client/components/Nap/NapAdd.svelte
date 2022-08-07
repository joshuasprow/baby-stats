<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import NapAmountInput from "$components/Nap/NapAmountInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { addNap } from "$stores/naps";
  import { parseError } from "baby-stats-lib/error";
  import { NapAdd } from "baby-stats-models/naps";

  let add: NapAdd = {
    amount: 2,
    kind: "naps",
    timestamp: new Date(),
  };

  let error: null | string = null;
  let loading = false;
  let open = false;

  const setAdd = (fields: Partial<NapAdd>) => {
    const [a, e] = addEntryFields(NapAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  $: if (open) setAdd({ timestamp: new Date() });

  const handleAmount = (e: CustomEvent<number>) => setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Date>) =>
    setAdd({ timestamp: e.detail });

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

<EntryAddModal
  bind:open
  {loading}
  on:add={handleAdd}
  on:timestamp={handleTimestamp}
  timestamp={add.timestamp}
>
  <span slot="icon">💤</span>

  <article>
    <NapAmountInput amount={add.amount} {loading} on:change={handleAmount} />
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
