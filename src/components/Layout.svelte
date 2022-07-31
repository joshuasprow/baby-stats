<script lang="ts">
  import { days } from "$stores/days";
  import { user } from "$stores/user";
  import Actions from "./Actions.svelte";
  import Entry from "./Entry.svelte";
  import Nav from "./Nav.svelte";
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
{:else}
  <main>
    {#each $days as [daystamp, day] (daystamp)}
      <div>{new Date(daystamp).toDateString()}</div>
      {#each day as [_, entry] (entry.id)}
        <Entry {entry} />
      {/each}
    {/each}

    <Actions />
    <Nav />
  </main>
{/if}

<style>
  main {
    padding-bottom: var(--footer-height);
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
