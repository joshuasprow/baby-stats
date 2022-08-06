<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PeeAmountInput from "$components/Pee/PeeAmountInput.svelte";
  import { addPee } from "$stores/pees";
  import type { PeeAmount } from "baby-stats-models/pees";

  let amount: PeeAmount = 2;
  let loading = false;
  let timestamp = new Date();

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = async () => {
    loading = true;
    await addPee({ amount, kind: "pees", timestamp });
    loading = false;
  };
</script>

<EntryAddModal
  {loading}
  on:add={handleAdd}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <span slot="icon">💧</span>
  <article>
    <PeeAmountInput bind:amount />
  </article>
</EntryAddModal>
