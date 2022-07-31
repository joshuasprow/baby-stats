<script lang="ts">
  import { addPoop, type PoopAmount } from "$stores/poops";
  import EntryModal from "./EntryModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";

  let amount: PoopAmount = 2;

  const onAdd = () => addPoop({ amount });
</script>

<EntryModal icon="💩" okText="add" okCallback={onAdd}>
  <article>
    <PoopAmountInput bind:amount />
  </article>
</EntryModal>
