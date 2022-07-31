<script lang="ts">
  import { user } from "$stores/user";
  import { fade, fly } from "svelte/transition";
  import SignInButton from "./SignInButton.svelte";
  import SignOutButton from "./SignOutButton.svelte";

  let open = false;

  $: greeting = $user
    ? `Hi ${$user.displayName}`
    : "Hello, please sign in below";

  const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };
</script>

<button on:click={toggle}>🍔</button>

{#if open}
  <div class="backdrop" on:click={close} transition:fade />

  <aside transition:fly={{ x: window.innerWidth }}>
    <span>{greeting}</span>

    {#if $user}
      <SignOutButton />
    {:else}
      <SignInButton />
    {/if}
  </aside>
{/if}

<style>
  button {
    position: fixed;
    top: 0.25rem;
    right: 0.25rem;
    z-index: 100;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  aside {
    position: fixed;
    inset: 0;
    left: 0.5rem;
    background: #fff;
    padding: 2rem 0.5rem 0 0.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
