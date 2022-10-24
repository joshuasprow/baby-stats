<script lang="ts">
  import Entries from "$components/Entries.svelte";
  import SignInButton from "$components/SignInButton.svelte";
  import type { Baby } from "$models/babies";
  import type { User } from "$models/users";
  import type { Day } from "$stores/days";

  export let baby: Baby | undefined | null;
  export let days: Day[] | undefined;
  export let user: User | undefined | null;

  $: centered = user === undefined || baby === undefined || days === undefined;
</script>

<main class:centered>
  {#if user === undefined}
    <span>⏳</span>
  {/if}

  {#if user === null}
    <span class="sign-in-label">Please sign in below</span>
    <SignInButton />
  {/if}

  {#if baby && days}
    <Entries babyId={baby.id} {days} />
  {/if}
</main>

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

  .sign-in-label {
    margin-bottom: 1rem;
  }
</style>
