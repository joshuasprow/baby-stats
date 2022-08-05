<script lang="ts">
  import type { PeeAmount } from "$models/pees";
  import { addPee } from "$stores/pees";
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PeeAmountInput from "$components/PeeAmountInput.svelte";

  let amount: PeeAmount = 2;
  let timestamp = new Date();

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = () => addPee({ amount, kind: "pees", timestamp });
</script>

<EntryAddModal on:add={handleAdd} on:timestamp={handleTimestamp} {timestamp}>
  <span slot="icon">💧</span>
  <article>
    <PeeAmountInput bind:amount />
  </article>
</EntryAddModal>
