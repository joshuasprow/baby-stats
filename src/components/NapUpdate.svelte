<script lang="ts">
  import type { Nap } from "$models/naps";
  import { removeNap, updateNap } from "$stores/naps";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";
  import NapIcon from "./NapIcon.svelte";

  export let entry: Nap;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  const handleAmount = (e: CustomEvent<number>) => {
    amount = e.detail;
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleUpdate = () =>
    updateNap({ id: entry.id, amount, kind: "naps", timestamp });

  const handleRemove = () => removeNap(entry.id);
</script>

<EntryUpdateModal
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  on:update={handleUpdate}
  {timestamp}
>
  <NapIcon {amount} slot="icon" />

  <article>
    <NapAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
