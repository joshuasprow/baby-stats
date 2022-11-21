<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import Button from "./Button.svelte";

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered() {
      console.log("SW registered");
    },
    onRegisterError(error) {
      console.log("SW registration error:", error);
    },
  });

  const close = () => needRefresh.set(false);

  const handleKeydown = ({ key }: KeyboardEvent) => {
    if (key === "Enter") updateServiceWorker(true);
    if (key === "Escape") close();
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
</script>

{#if $needRefresh}
  <div class="backdrop" transition:fade />
  <!-- svelte-ignore a11y-click-events-have-key-events *see escape/enter handlers above -->
  <div class="wrapper" role="alert" on:click={close}>
    <aside class="modal" on:click|stopPropagation transition:fade>
      <header>✨ New Stuff ✨</header>

      <p>Click below to reload and update</p>

      <footer>
        <Button on:click={() => updateServiceWorker(true)}>Update</Button>
        <Button on:click={close}>Close</Button>
      </footer>
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
    margin: 0.5rem;
  }

  .modal header,
  .modal p {
    text-align: center;
  }

  .modal header {
    font-weight: bold;
  }

  .modal p {
    margin: 0.5rem 0;
  }

  .modal footer {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
</style>
