<script lang="ts">
  import Button from "$components/Button.svelte";
  import SignInButton from "$components/SignInButton.svelte";
  import SignOutButton from "$components/SignOutButton.svelte";
  import ThemeControls from "$components/ThemePicker.svelte";
  import { user } from "$stores/user";
  import { fade, fly } from "svelte/transition";

  export let open = true;

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };
</script>

<Button class="sider-toggle-button" on:click={toggle}>☰</Button>

{#if open}
  <div class="backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <header>
      <Button class="sider-close-button" on:click={toggle}>✖️</Button>
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

      {#if $user}
        <section transition:fly>
          <ThemeControls user={$user} />
        </section>
      {/if}
    </main>
  </aside>
{/if}

<style>
  :global(.sider-toggle-button) {
    position: fixed;
    top: 0.25rem;
    right: 0.5rem;
  }

  .backdrop {
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
    border-left: var(--border-width) solid #666;
    color: var(--background-font-color);
  }

  :global(.sider-close-button) {
    margin: 0 0 1rem auto;
    font-size: 0.75rem;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1rem;
  }

  p {
    margin: 0 0.5rem 0 0;
  }
</style>
