<script lang="ts">
  import type { Nap } from "$models/naps";
  import { removeNap, updateNap } from "$stores/naps";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";
  import NapIcon from "./NapIcon.svelte";

  export let entry: Nap;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  let loading = false;

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
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <NapIcon {amount} slot="icon" />

  <article>
    <NapAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
