<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import { fade } from "svelte/transition";
  import { pressEscape } from "../lib/actions";
  import logger from "../lib/logger";
  import { swNeedRefresh, updateServiceWorker } from "../stores/sw";
  import Button from "./Button.svelte";

  const close = () => swNeedRefresh.set(false);

  const handleUpdate = async () => {
    try {
      await updateServiceWorker(true);
    } catch (error) {
      logger.error(parseError(error));
    }
  };
</script>

{#if $swNeedRefresh}
  <div class="backdrop" transition:fade use:pressEscape={close} />
  <!-- svelte-ignore a11y-click-events-have-key-events *pressEscape action -->
  <div class="wrapper" role="alert" on:click={close}>
    <aside class="modal" on:click|stopPropagation transition:fade>
      <header>✨ New Stuff ✨</header>

      <p>Click below to reload and update</p>

      <footer>
        <Button on:click={handleUpdate}>Update</Button>
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
