<script lang="ts">
  import { Nap, removeNap, updateNap } from "$stores/naps";
  import EntryModal from "./EntryModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";
  import NapIcon from "./NapIcon.svelte";

  export let entry: Nap;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  const handleAmount = (e: CustomEvent<number>) => {
    amount = e.detail;
  };

  const onUpdateClick = () =>
    updateNap({ id: entry.id, amount, kind: "naps", timestamp });

  const onRemoveClick = () => removeNap(entry.id);
</script>

<EntryModal
  okText="update"
  okCallback={onUpdateClick}
  removeCallback={onRemoveClick}
>
  <NapIcon {amount} slot="icon" />

  <article>
    <NapAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryModal>
