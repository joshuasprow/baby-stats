<script lang="ts">
  import { addPee, type PeeAmount } from "$stores/pees";
  import EntryAddModal from "./EntryAddModal.svelte";
  import PeeAmountInput from "./PeeAmountInput.svelte";

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
