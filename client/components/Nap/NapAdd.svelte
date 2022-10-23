<script lang="ts" context="module">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import { addEntryFields } from "$stores/entries";
  import { Timestamp } from "@firebase/firestore";
  import { addNap } from "baby-stats-firebase/naps";
  import { parseError } from "baby-stats-lib/error";
  import { NapAdd } from "baby-stats-models/naps";
  import type { TimeRangeAmount } from "baby-stats-models/time";
  import { db } from "../../firebase";

  const getDefaultAdd = (): NapAdd => {
    const t = new Date();

    const s = new Date(t);
    const e = new Date(t);

    e.setMinutes(e.getMinutes() + 30);

    return {
      amount: { start: Timestamp.fromDate(s), end: Timestamp.fromDate(e) },
      kind: "naps",
      timestamp: Timestamp.fromDate(t),
    };
  };
</script>

<script lang="ts">
  export let babyId: string;

  let add: NapAdd = getDefaultAdd();

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<NapAdd>) => {
    const [a, e] = addEntryFields(NapAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => {
    const { amount, timestamp } = getDefaultAdd();

    setAdd({ amount, timestamp });
  };

  const handleAmount = (e: CustomEvent<TimeRangeAmount>) =>
    setAdd({ amount: e.detail, timestamp: e.detail.start });

  const handleAdd = async () => {
    loading = true;

    try {
      await addNap(db, babyId, add);
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
