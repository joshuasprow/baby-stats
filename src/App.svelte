<script lang="ts">
  import Nav from "$components/Nav.svelte";
  import Actions from "./components/Actions.svelte";
  import Entry from "./components/Entry.svelte";
  import SignInButton from "./components/SignInButton.svelte";
  import SignOutButton from "./components/SignOutButton.svelte";
  import { days } from "./stores/days";
  import { user } from "./stores/user";
</script>

<main>
  {#if $user === undefined}
    😵‍💫
  {:else if $user === null}
    <SignInButton />
  {:else}
    <SignOutButton />

    {#each $days as [daystamp, day] (daystamp)}
      <div>{new Date(daystamp).toDateString()}</div>
      {#each day as [_, entry] (entry.id)}
        <Entry {entry} />
      {/each}
    {/each}
  {/if}
</main>

<Actions />
<Nav />

<style global>
  :root {
    font-family: sans-serif;
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;

    --footer-height: 54px;
  }

  body {
    margin: 0;
  }

  main {
    padding-bottom: var(--footer-height);
  }

  button,
  input {
    font-size: 1rem;
  }

  pre {
    font-size: 0.5rem;
    line-height: 0.5rem;
  }
</style>
