<script lang="ts">
  import Button from "$components/Button.svelte";

  import DateTimePicker from "$components/DateTimePicker.svelte";
  import EntryModal from "$components/Entry/EntryModal.svelte";
  import type { Timestamp } from "baby-stats-firebase";
  import { createEventDispatcher } from "svelte";

  type T = $$Generic<Timestamp | undefined>;

  export let loading: boolean;
  export let timestamp: T = undefined as T;

  const dispatch = createEventDispatcher<{
    remove: void;
    timestamp: T;
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

  const handleTimestamp = (e: CustomEvent<Timestamp>) => {
    if (timestamp instanceof Date) dispatch("timestamp", e.detail as T);
  };

  const handleRemove = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, duration));

    dispatch("remove");
  };
</script>

<EntryModal {loading} on:close={handleClose} on:open={handleOpen} {open}>
  <Button disabled={loading} on:click={handleOpen} slot="button">
    <slot name="icon" />
  </Button>

  {#if timestamp}
    <DateTimePicker on:change={handleTimestamp} {timestamp} />
  {/if}

  <slot />

  <Button disabled={loading} on:click={handleRemove}>remove</Button>
</EntryModal>
