<script lang="ts">
  import { removePoop, updatePoop, type PoopAmount } from "$stores/poops";
  import EntryModal from "./EntryModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";
  import PoopIcon from "./PoopIcon.svelte";

  export let timestamp: Date;
  export let amount: PoopAmount;

  const handleAmount = (e: CustomEvent<PoopAmount>) => {
    amount = e.detail;
  };

  const onUpdateClick = () => updatePoop({ timestamp, amount });

  const onRemoveClick = () => removePoop(timestamp);
</script>

<EntryModal
  okText="update"
  okCallback={onUpdateClick}
  removeCallback={onRemoveClick}
>
  <PoopIcon {amount} slot="icon" />

  <article>
    <PoopAmountInput on:change={handleAmount} {amount} />
  </article>
</EntryModal>
