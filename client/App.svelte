<script lang="ts">
  import Layout from "$components/Layout/Layout.svelte";
  import { baby } from "$stores/baby";
  import { days } from "$stores/days";
  import { user } from "$stores/user";
  import "./main.css";
  import "./variables.css";
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Layout baby={$baby} days={$days} user={$user} />

<!-- 
{#if $user === undefined || $baby === null || $days === null}
  <main class="centered">
    <span>⏳</span>
  </main>
{:else if $user === null}
  <main class="centered">
    <span class="sign-in-label">Please sign in below</span>
    <SignInButton />
  </main>
{:else if $days.length === 0}
  <main class="centered">
    <span>Use the buttons below to add new entries</span>
  </main>
{:else}
  <main>
    <Entries babyId={$baby.id} days={$days} />
  </main>

  <Sider />
  <Footer babyId={$baby.id} />
{/if} -->
