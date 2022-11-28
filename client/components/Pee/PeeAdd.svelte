<script lang="ts">
  import { PeeAdd, type PeeAmount } from "@baby-stats/models/pees";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import logger from "../../lib/logger";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "@baby-stats/lib/error";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";

  export let babyId: string;
  export let userId: string;

  let add: PeeAdd = {
    babyId,
    userId,
    amount: 2,
    kind: "pees",
    timestamp: Timestamp.now(),
  };

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<PeeAdd>) => {
    const [a, e] = mergeEntryFields(PeeAdd, add, fields);
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
      await addEntry(db, add);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
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
