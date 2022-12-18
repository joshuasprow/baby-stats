<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { pressEscape } from "../lib/actions";

  const duration = 300;

  export let loading: boolean;
  export let open: boolean;

  const dispatch = createEventDispatcher<{ close: void }>();

  const handleClose = () => {
    if (loading) return;
    dispatch("close");
  };
</script>

{#if open}
  <div class="backdrop" transition:fade />
  <!-- svelte-ignore a11y-click-events-have-key-events *pressEscape action -->
  <div class="wrapper" on:click={handleClose} use:pressEscape={handleClose}>
    <aside
      class="modal"
      on:click|stopPropagation={() => {}}
      transition:fly={{ duration, y: window.innerHeight }}
    >
      <slot />
    </aside>
  </div>
{/if}

<style>
  .backdrop,
  .wrapper {
    position: fixed;
    inset: 0;
  }

  .backdrop {
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .modal {
    color: var(--background-font-color);
    background: var(--background-color);
    border: var(--border-width) solid var(--border-color-dark);
    border-radius: var(--border-radius);
    padding: 0.5rem;
  }
</style>
