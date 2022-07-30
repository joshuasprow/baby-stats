<script lang="ts">
  import GoogleIcon from "../components/GoogleIcon.svelte";
  import { signIn, user } from "../stores/user";

  $: disabled = $user === undefined || !!$user;
</script>

<pre>{$user?.uid}</pre>

<button {disabled} on:click={signIn}>
  <GoogleIcon {disabled} />
</button>
