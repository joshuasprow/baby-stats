<script context="module" lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { ENTRY_ICONS } from "@baby-stats/models/entries";
  import { MedAdd } from "@baby-stats/models/meds";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import { generateMedName } from "../../lib/meds";
  import Button from "../Button.svelte";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import Modal from "../Modal.svelte";
  import MedAmountInput from "./MedAmountInput.svelte";
  import MedNameInput from "./MedNameInput.svelte";

  const defaultAdd = ({
    babyId,
    userId,
  }: Pick<MedAdd, "babyId" | "userId">): MedAdd => ({
    babyId,
    userId,
    kind: "meds",
    name: generateMedName(),
    amount: 2,
    unit: "ml",
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

  const setAdd = (fields: Partial<MedAdd>) => {
    const [a, e] = mergeEntryFields(MedAdd, add, fields);
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

  const handleName = (e: CustomEvent<string>) => setAdd({ name: e.detail });

  const handleAmount = (e: CustomEvent<Pick<MedAdd, "amount" | "unit">>) =>
    setAdd({ ...e.detail });

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
  <span class="shadowed">{ENTRY_ICONS.meds}</span>
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <MedNameInput name={add.name} {loading} on:change={handleName} />
  </article>

  <article>
    <MedAmountInput amount={add.amount} {loading} on:change={handleAmount} />
  </article>
</Modal>

<style>
  article {
    margin: 0.25rem 0;
  }
</style>
