<script lang="ts">
  import type { Timestamp } from "@firebase/firestore";
  import { createEventDispatcher } from "svelte";
  import Button from "../Button.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";
  import EntryModal from "./EntryModal.svelte";

  type T = $$Generic<Timestamp | undefined>;

  export let loading: boolean;
  export let timestamp: T = undefined as T;

  let open = false;

  const dispatch = createEventDispatcher<{
    add: void;
    open: void;
    timestamp: Timestamp;
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

  const handleTimestamp = (e: CustomEvent<Timestamp>) =>
    dispatch("timestamp", e.detail);
</script>

<EntryModal on:close={handleClose} on:open={handleOpen} {open}>
  <Button disabled={loading} on:click={handleOpen} slot="button">
    <slot name="icon" />
  </Button>

  {#if timestamp}
    <DateTimePicker on:change={handleTimestamp} {timestamp} />
  {/if}

  <slot />

  <Button on:click={handleAdd}>add</Button>
</EntryModal>
