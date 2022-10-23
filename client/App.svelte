<script lang="ts">
  import SignInButton from "$components/SignInButton.svelte";
  import { baby } from "$stores/baby";
  import { feeds } from "$stores/feeds";
  import { naps } from "$stores/naps";
  import { pees } from "$stores/pees";
  import { poops } from "$stores/poops";
  import { user } from "$stores/user";
  import { updateBaby } from "baby-stats-firebase/babies";
  import { db } from "./firebase";
  import "./main.css";
  import "./variables.css";

  let name = "";

  const handleUpdate = async () => {
    if (!$baby) return;

    await updateBaby(db, { ...$baby, name });
  };
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
    <span class="sign-in-label">Please sign in below</span>
    <SignInButton />
  </main>
  <!-- {:else if !$entriesLoaded}
  <main class="centered">
    <span>Use the buttons below to add new entries</span>
  </main> -->
{:else}
  <main class="centered">
    <form on:submit|preventDefault={handleUpdate}>
      <input type="text" bind:value={name} />
      <button type="submit">Update</button>
    </form>
    <pre>{JSON.stringify($baby, null, 2)}</pre>
    <pre>{JSON.stringify(
        {
          feeds: $feeds?.length,
          naps: $naps?.length,
          pees: $pees?.length,
          poops: $poops?.length,
        },
        null,
        2,
      )}</pre>
  </main>
  <!-- <main>
    <Entries user={$user} />
  </main>

  <Sider />
  <Footer user={$user} /> -->
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

  .sign-in-label {
    margin-bottom: 1rem;
  }
</style>
