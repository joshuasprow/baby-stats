<script lang="ts" context="module">
  const duration = 300;
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let loading = false;
  export let open = false;

  const dispatch = createEventDispatcher<{ close: void; open: void }>();

  const handleOpen = () => {
    open = true;
    if (loading) return;
    dispatch("open");
  };

  const handleClose = () => {
    open = false;
    if (loading) return;
    dispatch("close");
  };
</script>

<button disabled={loading} on:click={handleOpen}>
  {#if $$slots.icon}
    <slot name="icon" />
  {:else}
    🚫
  {/if}
</button>

{#if open}
  <div class="backdrop" transition:fade />
  <div class="wrapper" on:click={handleClose}>
    <section
      class="modal"
      on:click|stopPropagation
      transition:fly={{ duration, y: window.innerHeight }}
    >
      <slot />
    </section>
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
    color: #000;
    background: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
</style>
