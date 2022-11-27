<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import logger from "../../lib/logger";
  import { parseError } from "@baby-stats/lib/error";
  import { user } from "../../stores/user";
  import Button from "../Button.svelte";
  import CloseIcon from "../CloseIcon.svelte";
  import LogViewer from "../LogViewer.svelte";
  import SignInButton from "../SignInButton.svelte";
  import SignOutButton from "../SignOutButton.svelte";

  export let open = false;

  let clearCacheDisabled = false;

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const log = () => logger.error(new Error("test error"));

  const clearCache = async () => {
    try {
      clearCacheDisabled = true;

      const keys = await caches.keys();

      for (const key of keys) {
        await caches.delete(key);
      }
    } catch (e) {
      logger.error(parseError(e));
    } finally {
      clearCacheDisabled = false;
    }
  };
</script>

<Button class="sider-toggle-button" on:click={toggle}>☰</Button>

{#if open}
  <div class="sider-backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <header>
      <Button class="sider-close-button" on:click={toggle}>
        <CloseIcon />
      </Button>
    </header>

    <main>
      <section>
        <p>
          {#if $user}
            Hi {$user.displayName}
          {:else}
            Hello, please sign in below
          {/if}
        </p>

        {#if $user}
          <SignOutButton />
        {:else}
          <SignInButton />
        {/if}
      </section>

      <section class="dev-controls">
        <Button on:click={log}>log test error</Button>

        <Button disabled={clearCacheDisabled} on:click={clearCache}>
          clear cache
        </Button>
      </section>

      <LogViewer />
      <!-- {#if $user}
        <section transition:fly>
          <ThemeControls user={$user} />
        </section>
      {/if} -->
    </main>
  </aside>
{/if}

<style>
  :global(.sider-toggle-button) {
    position: fixed;
    top: 0.25rem;
    right: 0.5rem;
  }

  .sider-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  aside {
    position: fixed;
    inset: 0;
    left: 1rem;
    background-color: var(--background-color);
    padding: 0.25rem 0.5rem;
    border-left: var(--border-width) solid var(--border-color-dark);
    color: var(--background-font-color);
  }

  :global(.sider-close-button) {
    margin: 0 0 1rem auto;
    font-size: 0.75rem;
  }

  header {
    height: 1.5rem;
  }

  main {
    display: grid;
    grid-template-rows: 1fr 1fr auto;
    justify-items: center;
    max-height: calc(100vh - 2rem);
  }

  section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  p {
    margin: 0 0.5rem 0 0;
  }
</style>
