<script lang="ts">
  import { addNap } from "$stores/naps";
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import NapAmountInput from "$components/NapAmountInput.svelte";

  let amount = 2;
  let timestamp = new Date();

  const handleAdd = () => addNap({ amount, kind: "naps", timestamp });
</script>

<EntryAddModal on:add={handleAdd} {timestamp}>
  <span slot="icon">💤</span>
  <article>
    <NapAmountInput bind:amount />
  </article>
</EntryAddModal>
