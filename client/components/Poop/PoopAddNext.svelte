<script context="module" lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { ENTRY_ICONS } from "@baby-stats/models/entries-base";
  import { PoopAdd, type PoopAmount } from "@baby-stats/models/poops";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";
  import Modal from "../Modal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";

  const defaultAdd = ({
    babyId,
    userId,
  }: Pick<PoopAdd, "babyId" | "userId">): PoopAdd => ({
    babyId,
    userId,
    amount: 2,
    kind: "poops",
    timestamp: Timestamp.now(),
  });
</script>

<script lang="ts">
  export let babyId: string;
  export let userId: string;

  let add = defaultAdd({ babyId, userId });

  let error: null | string = null;
  let loading = false;
  let open = false;

  const reset = () => {
    add = defaultAdd({ babyId, userId });
    error = null;
    loading = false;
    open = false;
  };

  const setAdd = (fields: Partial<PoopAdd>) => {
    const [a, e] = mergeEntryFields(PoopAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => {
    open = true;
    setAdd({ timestamp: Timestamp.now() });
  };

  const handleClose = () => {
    reset();
  };

  const handleAmount = (e: CustomEvent<PoopAmount>) =>
    setAdd({ amount: e.detail });

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    setAdd({ timestamp: e.detail });

  const handleAdd = async () => {
    try {
      loading = true;

      await addEntry(db, add);

      reset();
    } catch (e) {
      const parsed = parseError(e);

      error = parsed.message;
      loading = false;

      logger.error(parsed);
    }
  };
</script>

<Button disabled={loading} on:click={handleOpen}>
  <span class="shadowed">{ENTRY_ICONS.poops}</span>
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <DateTimePicker on:change={handleTimestamp} timestamp={add.timestamp} />
  </article>

  <article>
    <PoopAmountInput amount={add.amount} {loading} on:change={handleAmount} />
  </article>

  <article>
    <Button {loading} on:click={handleAdd} --width="100%">add</Button>
  </article>
</Modal>

<style>
  article {
    margin: 0.25rem 0;
  }
</style>
