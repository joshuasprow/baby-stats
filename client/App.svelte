<script lang="ts">
  import { parseError } from "@baby-stats/lib/error";
  import GlobalError, { setGlobalError } from "./components/GlobalError.svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import logger from "./lib/logger";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { user } from "./stores/user";

  import "./main.css";
  import "./variables.css";

  window.onunhandledrejection = (e) => {
    console.dir(e);

    const error = parseError(e.reason);

    setGlobalError(error);
    logger.error(error);
  };
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Layout baby={$baby} days={$days} user={$user} />

<ReloadPrompt />

<GlobalError />
