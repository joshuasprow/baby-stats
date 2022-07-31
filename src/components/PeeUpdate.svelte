<script lang="ts">
  import type { Pee, PeeAmount } from "$models/pees";
  import { removePee, updatePee } from "$stores/pees";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";
  import PeeIcon from "./PeeIcon.svelte";

  export let entry: Pee;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  const handleAmount = (e: CustomEvent<PeeAmount>) => {
    amount = e.detail;
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleUpdate = () =>
    updatePee({ id: entry.id, amount, kind: "pees", timestamp });

  const handleRemove = () => removePee(entry.id);
</script>

<EntryUpdateModal
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  on:update={handleUpdate}
  {timestamp}
>
  <PeeIcon {amount} slot="icon" />
  <article>
    <PeeAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
