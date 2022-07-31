<script lang="ts">
  import { signIn, user } from "$stores/user";
  import GoogleIcon from "./GoogleIcon.svelte";

  $: disabled = $user === undefined || !!$user;
</script>

<button {disabled} on:click={signIn}>
  <GoogleIcon {disabled} />
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
