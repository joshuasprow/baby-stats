<script lang="ts">
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { signIn, signOut, user } from "../stores/user";

  $: loading = $user === undefined;

  $: signInDisabled = loading || !!$user;
  $: signOutDisabled = !signInDisabled;
</script>

<pre>{$user?.uid}</pre>

<button disabled={signInDisabled} on:click={signIn}>
  <GoogleIcon disabled={signInDisabled} />
</button>

<button disabled={signOutDisabled} on:click={signOut}>Sign out</button>
