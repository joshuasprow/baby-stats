<script lang="ts">
  import { onMount } from "svelte";
  import { parseError } from "../../lib/error";

  let error: Error | null = new Error("test error");

  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.error(e.reason);
      error = parseError(e.reason);
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
