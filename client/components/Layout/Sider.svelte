<script lang="ts">
  import Button from "$components/Button.svelte";
  import SignInButton from "$components/SignInButton.svelte";
  import SignOutButton from "$components/SignOutButton.svelte";
  import { user } from "$stores/user";
  import { getColorVariableValue, hexToHsl } from "baby-stats-lib/colors";
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { fade, fly } from "svelte/transition";

  export let open = false;

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handleColorChange = (e: ChangeEvent) => {
    const hex = e.currentTarget.value;
    const hsl = hexToHsl(hex);

    document.documentElement.style.setProperty("--border-color", hsl);
  };
</script>

<Button class="sider-toggle-button" on:click={toggle}>☰</Button>

{#if open}
  <div class="backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <header>
      <Button on:click={toggle}>✖️</Button>
    </header>

    <section>
      <p>
        {#if $user}
          Hi {$user.displayName}
        {:else}
          Hello, please sign in below
        {/if}
      </p>
    </section>

    <section>
      {#if $user}
        <SignOutButton />
      {:else}
        <SignInButton />
      {/if}
    </section>
  </aside>
{/if}

<style>
  :global(.sider-toggle-button) {
    box-shadow: 0.1rem 0.1rem 0.3rem var(--border-color);
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
    background: #fff;
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-left: var(--border-width) solid #666;
  }

  header {
    margin-left: auto;
  }

  section {
    margin-bottom: 0.5rem;
  }
</style>
