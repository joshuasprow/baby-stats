<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { Med } from "@baby-stats/models/meds";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";
  import Modal from "../Modal.svelte";
  import RemoveButton from "../RemoveButton.svelte";
  import MedAmountInput from "./MedAmountInput.svelte";
  import MedIcon from "./MedIcon.svelte";
  import MedNameInput from "./MedNameInput.svelte";

  export let entry: Med;

  let error: null | string = null;
  let loading = false;
  let open = false;

  let update = { ...entry };

  const reset = () => {
    error = null;
    loading = false;
    open = false;

    update = { ...entry };
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

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

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
    try {
      loading = true;

      await removeEntry(db, entry.id);

      reset();
    } catch (e) {
      const parsed = parseError(e);

      error = parsed.message;
      loading = false;

      logger.error(parsed);
    }
  };
</script>

<Button on:click={handleOpen}>
  <MedIcon amount={update.amount} name={update.name} unit={update.unit} />
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <DateTimePicker on:change={handleTimestamp} timestamp={update.timestamp} />
  </article>

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

  <RemoveButton {loading} on:remove={handleRemove} />
</Modal>

<style>
  article {
    margin: 0.25rem 0;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
