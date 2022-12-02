<script lang="ts" context="module">
  import { writable } from "svelte/store";

  const error = writable<Error | null>(null);

  export const setGlobalError = (e: Error | null) => error.set(e);
</script>

<script lang="ts">
  import { pressEscape } from "../lib/actions";
  import Button from "./Button.svelte";

  let open = true;

  const reload = () => {
    window.location.reload();
  };

  const close = () => {
    open = false;
    setGlobalError(null);
  };
</script>

{#if $error && open}
  <!-- svelte-ignore a11y-click-events-have-key-events *pressEscape action -->
  <div class="error-backdrop" on:click={close} use:pressEscape={close}>
    <aside class="error-block">
      <p>
        {$error.message}
      </p>
      <p>You'll need to reload the page... maybe try again later?</p>

      <footer>
        <Button on:click={reload}>reload</Button>
        <Button on:click={close}>cancel</Button>
      </footer>
    </aside>
  </div>
{/if}

<style>
  .error-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .error-block {
    border: var(--border-width) solid var(--error-color);
    border-radius: var(--border-radius);
    background-color: var(--error-background-color);
    color: var(--error-color);
    max-width: 95vw;
    max-height: 95vh;
    overflow: auto;
    padding: 1rem;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
