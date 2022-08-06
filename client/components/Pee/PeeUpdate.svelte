<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import PeeIcon from "$components/Pee/PeeIcon.svelte";
  import { removePee, updatePee } from "$stores/pees";
  import type { Pee, PeeAmount } from "baby-stats-models/pees";

  export let entry: Pee;

  let amount = entry.amount;
  let loading = false;
  let timestamp = entry.timestamp;

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
