<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import { parseError } from "./lib/error";
  import "./main.css";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { user } from "./stores/user";
  import "./variables.css";

  let error: Error | null = null;

  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.error(e.reason);
      error = parseError(e.reason);
    };
  });
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

{#if error}
  <section class="error-wrapper">
    <article class="error-block">
      <p class="error">
        {error.message}
      </p>
      <p class="error">
        You'll need to reload the page... maybe try again later?
      </p>
    </article>
  </section>
{:else}
  <Layout baby={$baby} days={$days} user={$user} />
{/if}

<ReloadPrompt />

<style>
  .error-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
