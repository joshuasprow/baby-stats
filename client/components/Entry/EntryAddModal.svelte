<script lang="ts">
  import DateTimePicker from "$components/DateTimePicker.svelte";
  import EntryModal from "$components/Entry/EntryModal.svelte";
  import { createEventDispatcher } from "svelte";

  type T = $$Generic<Date | undefined>;

  export let loading: boolean;
  export let timestamp: T = undefined as T;

  let open = false;

  const dispatch = createEventDispatcher<{
    add: void;
    open: void;
    timestamp: Date;
  }>();

  const handleOpen = () => {
    open = true;

    dispatch("open");
  };

  const handleClose = () => {
    open = false;
  };

  const handleAdd = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, 300));

    dispatch("add");
  };

  const handleTimestamp = (e: CustomEvent<Date>) =>
    dispatch("timestamp", e.detail);
</script>

<EntryModal on:close={handleClose} on:open={handleOpen} {open}>
  <button disabled={loading} on:click={handleOpen} slot="button">
    <slot name="icon" />
  </button>

  {#if timestamp}
    <DateTimePicker on:change={handleTimestamp} {timestamp} />
  {/if}

  <slot />

  <button on:click={handleAdd}>add</button>
</EntryModal>
