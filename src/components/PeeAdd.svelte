<script lang="ts">
  import { addPee, type PeeAmount } from "$stores/pees";
  import EntryModal from "./EntryModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";

  let amount: PeeAmount = 2;

  const onAdd = () => addPee({ amount });
</script>

<EntryModal icon="💧" okText="add" onOk={onAdd}>
  <article>
    <PeeAmountInput bind:amount />
  </article>
</EntryModal>
