<script lang="ts">
  import { days } from "$stores/days";
  import { user } from "$stores/user";
  import Entries from "./Entries.svelte";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import SignInButton from "./SignInButton.svelte";
</script>

<!-- firebase hasn't loaded yet -->
{#if $user === undefined}
  <main class="centered">
    <span>⏳</span>
  </main>
  <!-- user is signed out -->
{:else if $user === null}
  <main class="centered">
    <span>Please sign in below</span>
    <SignInButton />
  </main>
{:else if $days.length === 0}
  <main class="centered">
    <span>Use the buttons below to add new entries</span>
  </main>
{:else}
  <main>
    <Entries />
  </main>

  <Footer />
  <Header />
{/if}

<style>
  main {
    padding: var(--action-bar-height) 0.5rem;
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
