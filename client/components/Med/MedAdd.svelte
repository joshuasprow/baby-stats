<script lang="ts">
  import { ENTRY_ICONS } from "@baby-stats/models/entries";
  import { MedAdd } from "@baby-stats/models/meds";
  import { Timestamp } from "@firebase/firestore";
  import { db } from "../../firebase";
  import { addEntry } from "../../firebase/entries";
  import logger from "../../firebase/logger";
  import { mergeEntryFields } from "../../lib/entries";
  import { parseError } from "@baby-stats/lib/error";
  import { generateMedName } from "../../lib/meds";
  import EntryAddModal from "../Entry/EntryAddModal.svelte";
  import MedAmountInput from "./MedAmountInput.svelte";
  import MedNameInput from "./MedNameInput.svelte";

  export let babyId: string;
  export let userId: string;

  let add: MedAdd = {
    babyId,
    userId,
    kind: "meds",
    name: generateMedName(),
    amount: 2,
    unit: "ml",
    timestamp: Timestamp.now(),
  };

  let error: null | string = null;
  let loading = false;

  const setAdd = (fields: Partial<MedAdd>) => {
    const [a, e] = mergeEntryFields(MedAdd, add, fields);
    if (e) {
      error = e.message;
    } else {
      add = a;
      error = null;
    }
  };

  const handleOpen = () => setAdd({ timestamp: Timestamp.now() });

  const handleName = (e: CustomEvent<string>) => setAdd({ name: e.detail });

  const handleAmount = (e: CustomEvent<Pick<MedAdd, "amount" | "unit">>) =>
    setAdd({ ...e.detail });

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    setAdd({ timestamp: e.detail });

  const handleAdd = async () => {
    loading = true;

    try {
      await addEntry(db, add);
    } catch (e) {
      const parsed = parseError(e);
      error = parsed.message;
      logger.error(parsed);
    }

    loading = false;
  };
</script>

<EntryAddModal
  {loading}
  on:add={handleAdd}
  on:open={handleOpen}
  on:timestamp={handleTimestamp}
  timestamp={add.timestamp}
>
  <span class="shadowed" slot="icon">{ENTRY_ICONS.meds}</span>

  <article>
    <MedNameInput name={add.name} {loading} on:change={handleName} />
  </article>

  <article>
    <MedAmountInput amount={add.amount} {loading} on:change={handleAmount} />
  </article>
</EntryAddModal>

<style>
  article {
    margin: 0.25rem 0;
  }
</style>
