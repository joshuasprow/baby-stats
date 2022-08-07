<script lang="ts">
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import NapAmountInput from "$components/Nap/NapAmountInput.svelte";
  import NapIcon from "$components/Nap/NapIcon.svelte";
  import { removeNap, updateNap } from "$stores/naps";
  import type { Nap } from "baby-stats-models/naps";

  export let entry: Nap;

  let amount = entry.amount;
  let loading = false;
  let timestamp = entry.timestamp;

  const update = async () => {
    loading = true;
    await updateNap({ id: entry.id, amount, kind: "naps", timestamp });
    loading = false;
  };

  const handleAmount = async (e: CustomEvent<number>) => {
    amount = e.detail;
    await update();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    timestamp = e.detail;
    await update();
  };

  const handleRemove = () => removeNap(entry.id);
</script>

<EntryUpdateModal
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <NapIcon {amount} slot="icon" />

  <article>
    <NapAmountInput {loading} on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
