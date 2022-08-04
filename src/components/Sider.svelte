<script lang="ts">
  import { user } from "$stores/user";
  import { fade, fly } from "svelte/transition";
  import SignInButton from "./SignInButton.svelte";
  import SignOutButton from "./SignOutButton.svelte";

  export let buttonClass = "sider-button";
  export let open = false;

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };
</script>

<button class={buttonClass} on:click={toggle}>🍔</button>

{#if open}
  <div class="backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <button class="close" on:click={toggle}>❌</button>

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

  .close {
    margin-left: auto;
  }
</style>
