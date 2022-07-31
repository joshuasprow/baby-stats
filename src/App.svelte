<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import DatePicker from "./components/DatePicker.svelte";
  import DateTimePicker from "./components/DateTimePicker.svelte";
  import Entry from "./components/Entry.svelte";
  import SignInButton from "./components/SignInButton.svelte";
  import SignOutButton from "./components/SignOutButton.svelte";
  import { days } from "./stores/days.next";
  import { user } from "./stores/user";
</script>

<main>
  <DateTimePicker />
  {#if $user === undefined}
    😵‍💫
  {:else if $user === null}
    <SignInButton />
  {:else}
    <SignOutButton />

    <DatePicker />

    {#each $days as [daystamp, day] (daystamp)}
      <div>{new Date(daystamp).toDateString()}</div>
      {#each day as [timestamp, entry] (timestamp)}
        <Entry {timestamp} entry={{ ...entry }} />
      {/each}
    {/each}
  {/if}
</main>

<Actions />

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
