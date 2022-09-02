<script lang="ts">
  import Entries from "$components/Entries.svelte";
  import Footer from "$components/Layout/Footer.svelte";
  import Header from "$components/Layout/Header.svelte";
  import SignInButton from "$components/SignInButton.svelte";
  import { entriesLoaded } from "$stores/entries";
  import { user } from "$stores/user";
</script>

{#if $user === undefined}
  <main class="centered">
    <span>⏳</span>
  </main>
{:else if $user === null}
  <main class="centered">
    <span>Please sign in below</span>
    <SignInButton />
  </main>
{:else if !entriesLoaded}
  <main class="centered">
    <span>Use the buttons below to add new entries</span>
  </main>
{:else}
  <main>
    <Entries user={$user} />
  </main>

  <Header />
  <Footer user={$user} />
{/if}

<style>
  main {
    padding: 0.5rem 0.5rem var(--action-bar-height) 0.5rem;
    background-color: var(--background-color);
  }

  .centered {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
