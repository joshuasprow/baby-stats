<script lang="ts">
  import { signIn, user } from "$stores/user";
  import GoogleIcon from "$components/GoogleIcon.svelte";
  import Button from "./Button.svelte";

  $: disabled = $user === undefined || !!$user;
</script>

<Button {disabled} on:click={signIn}>
  <GoogleIcon {disabled} />
</Button>
