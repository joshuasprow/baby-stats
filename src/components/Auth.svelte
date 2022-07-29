<script lang="ts">
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { user } from "../stores/user";

  $: loading = $user === undefined;

  $: signInDisabled = loading || !!$user;
  $: signOutDisabled = !signInDisabled;
</script>

<pre>{$user?.uid}</pre>

<button disabled={signInDisabled} on:click={user.sign_in}>
  <GoogleIcon disabled={signInDisabled} />
</button>

<button disabled={signOutDisabled} on:click={user.sign_out}>Sign out</button>
