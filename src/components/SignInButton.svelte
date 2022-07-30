<script lang="ts">
  import { signIn, user } from "$stores/user";
  import GoogleIcon from "./GoogleIcon.svelte";

  $: disabled = $user === undefined || !!$user;
</script>

<pre>{$user?.uid}</pre>

<button {disabled} on:click={signIn}>
  <GoogleIcon {disabled} />
</button>
