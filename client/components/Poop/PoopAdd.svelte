<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PoopAmountInput from "$components/Poop/PoopAmountInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { addPoop } from "$stores/poops";
  import { Timestamp } from "baby-stats-firebase/types";
  import { parseError } from "baby-stats-lib/error";
  import { PoopAdd, type PoopAmount } from "baby-stats-models/poops";

  let add: PoopAdd = {
    amount: 2,
    kind: "poops",
    timestamp: Timestamp.now(),
  };

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<PoopAdd>) => {
    const [a, e] = addEntryFields(PoopAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => setAdd({ timestamp: Timestamp.now() });

  const handleAmount = (e: CustomEvent<PoopAmount>) =>
    setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    setAdd({ timestamp: e.detail });

  const handleAdd = async () => {
    loading = true;

    try {
      await addPoop(add);
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
  <span slot="icon">💩</span>

  <article>
    <PoopAmountInput amount={add.amount} {loading} on:change={handleAmount} />
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
