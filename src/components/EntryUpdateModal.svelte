<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import DateTimePicker from "./DateTimePicker.svelte";
  import EntryModalNext from "./EntryModalNext.svelte";

  export let timestamp = new Date();

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

  const handleUpdate = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, duration));

    dispatch("update");
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    dispatch("timestamp", e.detail);
  };

  const handleRemove = async () => {
    handleClose();

    await new Promise((resolve) => setTimeout(resolve, duration));

    dispatch("remove");
  };
</script>

<button on:click={handleOpen}>
  {#if $$slots.icon}
    <slot name="icon" />
  {:else}
    🚫
  {/if}
</button>

<EntryModalNext on:close={handleClose} on:open={handleOpen} {open}>
  <slot name="icon" slot="icon" />
  <DateTimePicker on:change={handleTimestamp} {timestamp} />
  <slot />
  <button on:click={handleUpdate}>update</button>
  <button on:click={handleRemove}>remove</button>
</EntryModalNext>
