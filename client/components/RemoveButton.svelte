<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import Modal from "./Modal.svelte";

  export let loading: boolean;

  let open = false;

  const dispatch = createEventDispatcher<{
    remove: void;
  }>();

  const handleOpen = () => {
    open = true;
  };

  const handleClose = () => {
    open = false;
  };

  const handleRemove = () => {
    handleClose();
    dispatch("remove");
  };
</script>

<Button {loading} on:click={handleOpen} --width="100%">remove</Button>

<Modal {loading} {open} on:close={handleClose}>
  <p>Are you sure?</p>
  <footer>
    <Button {loading} on:click={handleRemove}>remove</Button>
    <Button {loading} on:click={handleClose}>cancel</Button>
  </footer>
</Modal>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
</style>
