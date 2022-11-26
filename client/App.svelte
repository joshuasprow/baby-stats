<script lang="ts">
  import Button from "./components/Button.svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import logger from "./firebase/logger";
  import "./main.css";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { accessToken, user } from "./stores/user";
  import "./variables.css";

  $: disabled = $accessToken === null;
  let loading = false;

  const log = async () => {
    logger.log("log button clicked");
  };
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Button {disabled} {loading} on:click={log}>log</Button>
<Layout baby={$baby} days={$days} user={$user} />

<ReloadPrompt />
