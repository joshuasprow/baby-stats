<script lang="ts">
  import type { PoopAmount } from "$models/poops";
  import { addPoop } from "$stores/poops";
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PoopAmountInput from "./PoopAmountInput.svelte";

  let amount: PoopAmount = 2;
  let timestamp = new Date();

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = () => addPoop({ amount, kind: "poops", timestamp });
</script>

<EntryAddModal on:add={handleAdd} on:timestamp={handleTimestamp} {timestamp}>
  <span slot="icon">💩</span>
  <article>
    <PoopAmountInput bind:amount />
  </article>
</EntryAddModal>
