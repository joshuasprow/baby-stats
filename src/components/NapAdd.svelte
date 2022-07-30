<script lang="ts">
  import { addNap } from "$stores/naps";
  import EntryModal from "./EntryModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";

  let amount = 2;

  const onAdd = () => addNap({ amount });
</script>

<EntryModal icon="💤" okText="add" onOk={onAdd}>
  <article>
    <NapAmountInput bind:amount />
  </article>
</EntryModal>
