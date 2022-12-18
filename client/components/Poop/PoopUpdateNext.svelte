<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { Poop, type PoopAmount } from "@baby-stats/models/poops";
  import type { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";
  import Modal from "../Modal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";
  import PoopIcon from "./PoopIcon.svelte";

  export let entry: Poop;

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

  const setUpdate = (fields: Partial<Poop>) => {
    const [u, e] = mergeEntryFields(Poop, update, fields);
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

  const handleAmount = async (e: CustomEvent<PoopAmount>) => {
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
  <PoopIcon amount={update.amount} />
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <DateTimePicker on:change={handleTimestamp} timestamp={update.timestamp} />
  </article>

  <article>
    <PoopAmountInput
      amount={update.amount}
      {loading}
      on:change={handleAmount}
    />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}

  <Button {loading} on:click={handleRemove} --width="100%">remove</Button>
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
