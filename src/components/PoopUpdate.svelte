<script lang="ts">
  import type { Poop, PoopAmount } from "$models/poops";
  import { removePoop, updatePoop } from "$stores/poops";
  import EntryUpdateModal from "$components/Entry/EntryUpdateModal.svelte";
  import PoopAmountInput from "$components/PoopAmountInput.svelte";
  import PoopIcon from "$components/PoopIcon.svelte";

  export let entry: Poop;

  let amount = entry.amount;
  let timestamp = entry.timestamp;

  let loading = false;

  const update = async () => {
    loading = true;
    await updatePoop({ id: entry.id, amount, kind: "poops", timestamp });
    loading = false;
  };

  const handleAmount = async (e: CustomEvent<PoopAmount>) => {
    amount = e.detail;
    await update();
  };

  const handleTimestamp = async (e: CustomEvent<Date>) => {
    timestamp = e.detail;
    await update();
  };

  const handleRemove = () => removePoop(entry.id);
</script>

<EntryUpdateModal
  {loading}
  on:remove={handleRemove}
  on:timestamp={handleTimestamp}
  {timestamp}
>
  <PoopIcon {amount} slot="icon" />
  <article>
    <PoopAmountInput {loading} on:change={handleAmount} {amount} />
  </article>
</EntryUpdateModal>
