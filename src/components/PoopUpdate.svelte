<script lang="ts">
  import {
    removePoop,
    updatePoop,
    type Poop,
    type PoopAmount,
  } from "$stores/poops";
  import EntryUpdateModal from "./EntryUpdateModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";
  import PoopIcon from "./PoopIcon.svelte";

  export let entry: Poop;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  const handleAmount = (e: CustomEvent<PoopAmount>) => {
    amount = e.detail;
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleUpdate = () =>
    updatePoop({ id: entry.id, amount, kind: "poops", timestamp });

  const handleRemove = () => removePoop(entry.id);
</script>

<EntryUpdateModal
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  on:update={handleUpdate}
  {timestamp}
>
  <PoopIcon {amount} slot="icon" />
  <article>
    <PoopAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
