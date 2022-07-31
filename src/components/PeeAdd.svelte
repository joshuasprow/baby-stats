<script lang="ts">
  import { addPee, type PeeAmount } from "$stores/pees";
  import EntryModal from "./EntryModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";

  let amount: PeeAmount = 2;
  let timestamp = new Date();

  const onAdd = () => addPee({ amount, kind: "pees", timestamp });
</script>

<EntryModal icon="💧" okText="add" okCallback={onAdd}>
  <article>
    <PeeAmountInput bind:amount />
  </article>
</EntryModal>
