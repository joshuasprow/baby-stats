<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import { addEntryFields } from "$stores/entries";
  import { Timestamp } from "baby-stats-firebase";
  import { addPee } from "baby-stats-firebase/pees";
  import { parseError } from "baby-stats-lib/error";
  import { PeeAdd, type PeeAmount } from "baby-stats-models/pees";
  import type { User } from "baby-stats-models/users";

  export let user: User;

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
      await addPee(user.uid, add);
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
  .error {
    color: red;
    font-weight: bold;
  }
</style>
