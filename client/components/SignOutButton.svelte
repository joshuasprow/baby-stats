<script lang="ts">
  import { signOut, user } from "$stores/user";
  import Button from "./Button.svelte";

  $: disabled = $user === undefined || !$user;
</script>

<Button {disabled} on:click={signOut}>Sign out</Button>
