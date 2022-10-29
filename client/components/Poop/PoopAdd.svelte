<script lang="ts">
  import { addPoop } from "@baby-stats/firebase/poops";
  import { parseError } from "@baby-stats/lib/error";
  import { PoopAdd, type PoopAmount } from "@baby-stats/models/poops";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntryFields } from "../../stores/entries";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";

  export let babyId: string;
  export let userId: string;

  let add: PoopAdd = {
    babyId,
    userId,
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
      await addPoop(db, babyId, add);
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
  <span class="shadowed" slot="icon">💩</span>

  <article>
    <PoopAmountInput amount={add.amount} {loading} on:change={handleAmount} />
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
