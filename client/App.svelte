<script lang="ts">
  import Entries from "$components/Entries.svelte";
  import Footer from "$components/Layout/Footer.svelte";
  import Header from "$components/Layout/Header.svelte";
  import Sider from "$components/Layout/Sider.svelte";
  import { entriesLoaded } from "$stores/entries";
  import { user } from "$stores/user";
  // TODO: add baby name to title
  // import { user } from "$stores/user";
  import "./main.css";
  import "./variables.css";
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

{#if $user === undefined}
  <main class="centered">
    <span>⏳</span>
  </main>
{:else if $user === null}
  <main class="centered">
    <span>Please sign in below</span>
  </main>
{:else if !entriesLoaded}
  <main class="centered">
    <span>Use the buttons below to add new entries</span>
  </main>
{:else}
  <main>
    <Entries user={$user} />
  </main>

  <Sider />
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
