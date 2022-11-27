<script lang="ts" context="module">
  import { NapAdd } from "@baby-stats/models/naps";
  import { Timestamp } from "@firebase/firestore";

  const getDefaultAdd = ({
    babyId,
    userId,
  }: {
    babyId: string;
    userId: string;
  }): NapAdd => {
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
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "@baby-stats/lib/error";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import TimeRangePicker from "../TimeRangePicker.svelte";

  export let babyId: string;
  export let userId: string;

  let add = getDefaultAdd({ babyId, userId });

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<NapAdd>) => {
    const [a, e] = mergeEntryFields(NapAdd, { ...add, babyId, userId }, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => {
    const { amount, timestamp } = getDefaultAdd({ babyId, userId });

    setAdd({ amount, timestamp });
  };

  const handleAmount = (e: CustomEvent<TimeRangeAmount>) =>
    setAdd({ amount: e.detail, timestamp: e.detail.start });

  const handleAdd = async () => {
    loading = true;

    try {
      await addEntry(db, { ...add, babyId, userId });
    } catch (e) {
      error = parseError(e).message;
    }

    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd} on:open={handleOpen}>
  <span class="shadowed" slot="icon">💤</span>

  <article>
    <TimeRangePicker
      start={add.amount.start}
      end={add.amount.end}
      on:change={handleAmount}
    />
  </article>

  {#if error}
    <span class="error">{error}</span>
  {/if}
</EntryAddModal>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
</style>
