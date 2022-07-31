<script lang="ts">
  import { addNap } from "$stores/naps";
  import EntryModal from "./EntryModal.svelte";
  import NapAmountInput from "./NapAmountInput.svelte";

  let amount = 2;
  let timestamp = new Date();

  const onAdd = () => addNap({ amount, kind: "naps", timestamp });
</script>

<EntryModal icon="💤" okText="add" okCallback={onAdd}>
  <article>
    <NapAmountInput bind:amount />
  </article>
</EntryModal>
