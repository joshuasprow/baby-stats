<script lang="ts">
  import { removePee, updatePee, type PeeAmount } from "../stores/pees";
  import EntryModal from "./EntryModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";
  import PeeIcon from "./PeeIcon.svelte";

  export let timestamp: Date;
  export let amount: PeeAmount;

  const handleAmount = (e: CustomEvent<PeeAmount>) => {
    amount = e.detail;
  };

  const onUpdateClick = () => updatePee({ timestamp, amount });

  const onRemoveClick = () => removePee(timestamp);
</script>

<EntryModal okText="update" onOk={onUpdateClick} onRemove={onRemoveClick}>
  <PeeIcon {amount} slot="icon" />

  <article>
    <PeeAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryModal>
