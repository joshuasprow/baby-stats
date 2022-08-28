<script lang="ts">
  import Button from "$components/Button.svelte";
  import MenuIcon from "$components/MenuIcon.svelte";
  import SignInButton from "$components/SignInButton.svelte";
  import SignOutButton from "$components/SignOutButton.svelte";
  import { user } from "$stores/user";
  import { fade, fly } from "svelte/transition";

  export let open = false;

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };
</script>

<button class="sider-toggle-button" on:click={toggle}><MenuIcon /></button>

{#if open}
  <div class="backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <Button on:click={toggle}>❌</Button>

    <span>
      {#if $user}
        Hi {$user.displayName}
      {:else}
        Hello, please sign in below
      {/if}
    </span>

    {#if $user}
      <SignOutButton />
    {:else}
      <SignInButton />
    {/if}
  </aside>
{/if}

<style>
  .sider-toggle-button {
    background-color: #fff;
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
  }
</style>
