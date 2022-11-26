<script lang="ts">
  import { onMount } from "svelte";
  import logger from "../../firebase/logger";
  import { parseError } from "../../lib/error";

  let error: Error | null = null;

  onMount(() => {
    window.onunhandledrejection = (e) => {
      error = parseError(e.reason);
      logger.error(error);
    };
  });
</script>

{#if error}
  <section class="error-backdrop">
    <article class="error-block">
      <p class="error">
        {error.message}
      </p>
      <p class="error">
        You'll need to reload the page... maybe try again later?
      </p>
    </article>
  </section>
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

  .error {
    background-color: var(--color-error);
    color: var(--color-error-text);
  }
</style>
