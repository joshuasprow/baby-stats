<script lang="ts">
  import { signOut, user } from "../stores/user";

  $: disabled = $user === undefined || !$user;
</script>

<button {disabled} on:click={signOut}>Sign out</button>
