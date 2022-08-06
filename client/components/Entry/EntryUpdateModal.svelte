<script lang="ts">
  import DateTimePicker from "$components/DateTimePicker.svelte";
  import EntryModal from "$components/Entry/EntryModal.svelte";
  import { createEventDispatcher } from "svelte";

  export let loading: boolean;
  export let timestamp: Date;

  const dispatch = createEventDispatcher<{
    remove: void;
    timestamp: Date;
    update: void;
  }>();
  const duration = 300;

  let open = false;

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

  const handleTimestamp = (e: CustomEvent<Date>) =>
    dispatch("timestamp", e.detail);

  const handleRemove = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, duration));

    dispatch("remove");
  };
</script>

<EntryModal {loading} on:close={handleClose} on:open={handleOpen} {open}>
  <button disabled={loading} on:click={handleOpen} slot="button">
    <slot name="icon" />
  </button>

  <DateTimePicker {loading} on:change={handleTimestamp} {timestamp} />

  <slot />

  <button disabled={loading} on:click={handleRemove}>remove</button>
</EntryModal>
