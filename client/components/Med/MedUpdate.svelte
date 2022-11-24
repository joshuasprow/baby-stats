<script lang="ts">
  import { Med } from "@baby-stats/models/meds";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import logger from "../../firebase/logger";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "../../lib/error";
  import EntryUpdateModal from "../Entry/EntryUpdateModal.svelte";
  import MedAmountInput from "./MedAmountInput.svelte";
  import MedIcon from "./MedIcon.svelte";
  import MedNameInput from "./MedNameInput.svelte";

  export let entry: Med;

  let update = { ...entry };

  let error: null | string = null;
  let loading = false;

  const handleUpdate = async () => {
    loading = true;

    try {
      await updateEntry(db, update);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
    }

    loading = false;
  };

  const setUpdate = (fields: Partial<Med>) => {
    const [u, e] = mergeEntryFields(Med, update, fields);
    if (e) {
      error = e.message;
    } else {
      update = u;
      error = null;
    }
  };

  const handleName = (e: CustomEvent<string>) => setUpdate({ name: e.detail });

  const handleAmount = async (e: CustomEvent<Pick<Med, "amount" | "unit">>) => {
    setUpdate({ ...e.detail });

    await handleUpdate();
  };

  const handleTimestamp = async (e: CustomEvent<Timestamp>) => {
    setUpdate({ timestamp: e.detail });

    await handleUpdate();
  };

  const handleRemove = async () => {
    loading = true;

    try {
      await removeEntry(db, entry.id);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
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
  <MedIcon
    amount={update.amount}
    name={update.name}
    unit={update.unit}
    slot="icon"
  />

  <article>
    <MedNameInput name={update.name} {loading} on:change={handleName} />
  </article>

  <article>
    <MedAmountInput
      amount={update.amount}
      unit={update.unit}
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
