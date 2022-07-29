<script lang="ts">
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { user } from "../stores/user";

  $: loading = $user === undefined;
</script>

<pre>{$user?.uid}</pre>

<button disabled={loading || !!$user} on:click={user.sign_in}>
  <GoogleIcon disabled={loading || !!$user} />
</button>

<button disabled={loading || !$user} on:click={user.sign_out}>Sign out</button>
