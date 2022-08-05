<script lang="ts">
  import type { Pee, PeeAmount } from "$models/pees";
  import { removePee, updatePee } from "$stores/pees";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";
  import PeeIcon from "./PeeIcon.svelte";

  export let entry: Pee;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  let loading = false;

  const update = async () => {
    loading = true;
    await updatePee({
      id: entry.id,
      amount,
      kind: "pees",
      timestamp,
    } as Pee);
    loading = false;
  };

  const handleAmount = async (e: CustomEvent<PeeAmount>) => {
    amount = e.detail;
    await update();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    timestamp = e.detail;
    await update();
  };

  const handleRemove = () => removePee(entry.id);
</script>

<EntryUpdateModal
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <PeeIcon {amount} slot="icon" />
  <article>
    <PeeAmountInput {loading} on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
