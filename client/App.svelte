<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import { parseError } from "./lib/error";
  import "./main.css";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { user } from "./stores/user";
  import "./variables.css";
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Layout baby={$baby} days={$days} user={$user} />

<ReloadPrompt />
