<script lang="ts">
  import { addNap } from "$stores/naps";
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import NapAmountInput from "$components/Nap/NapAmountInput.svelte";

  let amount = 2;
  let loading = false;
  let timestamp = new Date();

  const handleAdd = async () => {
    loading = true;
    await addNap({ amount, kind: "naps", timestamp });
    loading = false;
  };
</script>

<EntryAddModal {loading} on:add={handleAdd} {timestamp}>
  <span slot="icon">💤</span>
  <article>
    <NapAmountInput bind:amount />
  </article>
</EntryAddModal>
