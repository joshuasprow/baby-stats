<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { Pee, type PeeAmount } from "@baby-stats/models/pees";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";
  import Modal from "../Modal.svelte";
  import RemoveButton from "../RemoveButton.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";
  import PeeIcon from "./PeeIcon.svelte";

  export let entry: Pee;

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

  const setUpdate = (fields: Partial<Pee>) => {
    const [u, e] = mergeEntryFields(Pee, update, fields);
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

  const handleAmount = async (e: CustomEvent<PeeAmount>) => {
    setUpdate({ amount: e.detail });

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
  <PeeIcon amount={update.amount} />
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <DateTimePicker on:change={handleTimestamp} timestamp={update.timestamp} />
  </article>

  <article>
    <PeeAmountInput amount={update.amount} {loading} on:change={handleAmount} />
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
