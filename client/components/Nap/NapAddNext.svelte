<script context="module" lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { ENTRY_ICONS } from "@baby-stats/models/entries-base";
  import { NapAdd } from "@baby-stats/models/naps";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import logger from "../../lib/logger";
  import Button from "../Button.svelte";
  import Modal from "../Modal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";

  const defaultAdd = ({
    babyId,
    userId,
  }: Pick<NapAdd, "babyId" | "userId">): NapAdd => {
    const t = new Date();

    const s = new Date(t);
    const e = new Date(t);

    e.setMinutes(e.getMinutes() + 30);

    return {
      babyId,
      userId,
      amount: { start: Timestamp.fromDate(s), end: Timestamp.fromDate(e) },
      kind: "naps",
      timestamp: Timestamp.fromDate(t),
    };
  };
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

  const setAdd = (fields: Partial<NapAdd>) => {
    const [a, e] = mergeEntryFields(NapAdd, add, fields);
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

  const handleAmount = (e: CustomEvent<TimeRangeAmount>) =>
    setAdd({ amount: e.detail, timestamp: e.detail.start });

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
  <span class="shadowed">{ENTRY_ICONS.naps}</span>
</Button>

<Modal {loading} {open} on:close={handleClose}>
  <article>
    <TimeRangePicker
      on:change={handleAmount}
      start={add.amount.start}
      end={add.amount.end}
    />
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
