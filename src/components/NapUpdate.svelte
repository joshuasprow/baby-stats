<script lang="ts">
  import { removeNap, updateNap } from "../stores/naps";
  import EntryModal from "./EntryModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";
  import NapIcon from "./NapIcon.svelte";

  export let timestamp: Date;
  export let amount: number;

  const handleAmount = (e: CustomEvent<number>) => {
    amount = e.detail;
  };

  const onUpdateClick = () => updateNap({ timestamp, amount });

  const onRemoveClick = () => removeNap(timestamp);
</script>

<EntryModal okText="update" onOk={onUpdateClick} onRemove={onRemoveClick}>
  <NapIcon {amount} slot="icon" />

  <article>
    <NapAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryModal>
