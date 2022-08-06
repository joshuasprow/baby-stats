<script lang="ts">
  import DateTimePicker from "$components/DateTimePicker.svelte";
  import EntryModal from "$components/Entry/EntryModal.svelte";
  import { createEventDispatcher } from "svelte";

  export let loading: boolean;
  export let timestamp = new Date();

  const dispatch = createEventDispatcher<{ add: void; timestamp: Date }>();

  let open = false;

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

  const handleAdd = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch("add");
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    console.log(e.detail);
    dispatch("timestamp", e.detail);
  };
</script>

<EntryModal on:close={handleClose} on:open={handleOpen} {open}>
  <button disabled={loading} on:click={handleOpen} slot="button">
    <slot name="icon" />
  </button>

  <DateTimePicker on:change={handleTimestamp} {timestamp} />

  <slot />

  <button on:click={handleAdd}>add</button>
</EntryModal>
