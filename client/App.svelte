<script lang="ts" context="module">
  import { parseError } from "@baby-stats/lib/error";
  import { setGlobalError } from "./components/GlobalError.svelte";

  window.onunhandledrejection = (e) => {
    console.dir(e);

    const error = parseError(e.reason);

    setGlobalError(error);

    logger.error(error);
  };
</script>

<script lang="ts">
  import GlobalError from "./components/GlobalError.svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import logger from "./lib/logger";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { user } from "./stores/user";

  import "./main.css";
  import "./variables.css";
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Layout baby={$baby} days={$days} user={$user} />

<ReloadPrompt />

<GlobalError />
