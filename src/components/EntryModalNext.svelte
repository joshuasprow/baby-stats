<script lang="ts" context="module">
  const duration = 300;
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  export let open = false;

  const dispatch = createEventDispatcher<{ close: void; open: void }>();
</script>

<button on:click={() => dispatch("open")}>
  {#if $$slots.icon}
    <slot name="icon" />
  {:else}
    🚫
  {/if}
</button>

{#if open}
  <aside on:click={() => dispatch("close")}>
    <section
      on:click|stopPropagation
      transition:fly={{ duration, y: 1000, opacity: 0 }}
    >
      <slot />
    </section>
  </aside>
{/if}

<style>
  aside {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section {
    color: #000;
    background: #fff;
    border: 1px solid #000;
    padding: 0.5rem;
  }
</style>
