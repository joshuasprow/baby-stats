<script lang="ts">
  import Actions from "./components/Actions.svelte";
  import DatePicker from "./components/DatePicker.svelte";
  import Day from "./components/Day.svelte";
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

    <DatePicker />

    {#each Object.entries($days) as [timestamp, day]}
      <Day {timestamp} {day} />
    {/each}
  {/if}
</main>

<Actions />
