<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DateTimePicker from "./DateTimePicker.svelte";
  import EntryModal from "./EntryModal.svelte";

  export let loading = false;
  export let timestamp: Date;

  const dispatch =
    createEventDispatcher<{ remove: void; timestamp: Date; update: void }>();
  const duration = 300;

  let open = false;

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    console.log(e.detail);
    dispatch("timestamp", e.detail);
  };

  const handleRemove = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, duration));

    dispatch("remove");
  };
</script>

<EntryModal on:close={handleClose} on:open={handleOpen} {open}>
  <slot name="icon" slot="icon" />
  <DateTimePicker {loading} on:change={handleTimestamp} {timestamp} />
  <slot />
  <button disabled={loading} on:click={handleRemove}>remove</button>
</EntryModal>
