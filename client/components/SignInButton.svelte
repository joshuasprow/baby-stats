<script lang="ts">
  import { signIn, user } from "../stores/user";
  import Button from "./Button.svelte";
  import GoogleIcon from "./GoogleIcon.svelte";

  $: disabled = $user === undefined || !!$user;
</script>

<Button {disabled} on:click={signIn}>
  <GoogleIcon {disabled} />
</Button>
