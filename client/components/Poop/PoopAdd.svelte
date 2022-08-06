<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import PoopAmountInput from "$components/Poop/PoopAmountInput.svelte";
  import type { PoopAmount } from "baby-stats-models/poops";
  import { addPoop } from "$stores/poops";

  let amount: PoopAmount = 2;
  let loading = false;
  let timestamp: Date;

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = async () => {
    loading = true;
    await addPoop({ amount, kind: "poops", timestamp });
    loading = false;
  };
</script>

<EntryAddModal
  bind:timestamp
  {loading}
  on:add={handleAdd}
  on:timestamp={handleTimestamp}
>
  <span slot="icon">💩</span>
  <article>
    <PoopAmountInput bind:amount />
  </article>
</EntryAddModal>
