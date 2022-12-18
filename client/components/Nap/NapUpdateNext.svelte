<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { Nap } from "@baby-stats/models/naps";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { db } from "../../firebase";
  import { removeEntry, updateEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import Modal from "../Modal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";
  import NapIcon from "./NapIcon.svelte";

  export let entry: Nap;

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

  const setUpdate = (fields: Partial<Nap>) => {
    const [u, e] = mergeEntryFields(Nap, update, fields);
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

  const handleAmount = async (e: CustomEvent<TimeRangeAmount>) => {
    setUpdate({ amount: e.detail, timestamp: e.detail.start });

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
  <NapIcon amount={update.amount} />
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <TimeRangePicker
      start={update.amount.start}
      end={update.amount.end}
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
