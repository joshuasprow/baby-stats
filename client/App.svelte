<script lang="ts">
  import type { Log } from "@baby-stats/models/logs";
  import Button from "./components/Button.svelte";
  import Layout from "./components/Layout/Layout.svelte";
  import ReloadPrompt from "./components/ReloadPrompt.svelte";
  import { options } from "./firebase";
  import "./main.css";
  import { baby } from "./stores/baby";
  import { days } from "./stores/days";
  import { accessToken, user } from "./stores/user";
  import "./variables.css";

  $: disabled = $accessToken === null;
  let loading = false;

  const log = async () => {
    const timestamp = Date.now();
    const collectionId = "logs";

    const name = `projects/${options.projectId}/databases/(default)/documents/${collectionId}`;
    const url = `https://firestore.googleapis.com/v1/${name}`;

    const entry: Log = {
      babyId: $baby ? $baby.id : null,
      error: null,
      level: "info",
      message: "test",
      timestamp,
      userId: $user ? $user.uid : null,
    };

    const payload = {
      fields: {
        babyId: {
          [entry.babyId ? "stringValue" : "nullValue"]: entry.babyId,
        },
        error: {
          nullValue: entry.error,
        },
        level: {
          stringValue: entry.level,
        },
        message: {
          stringValue: entry.message,
        },
        timestamp: {
          integerValue: entry.timestamp,
        },
        userId: {
          [entry.userId ? "stringValue" : "nullValue"]: entry.userId,
        },
      },
    };

    const body = JSON.stringify(payload);

    const headers = {
      Authorization: `Bearer ${$accessToken}`,
      "Content-Type": "application/json",
    };

    loading = true;

    //   const blob = new Blob([JSON.stringify(body)], headers);
    // navigator.sendBeacon('url', blob);

    try {
      const res = await fetch(url, {
        body,
        method: "POST",
        headers,
      });
      const json = await res.json();

      console.log(json);
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };
</script>

<svelte:head>
  <title>baby stats</title>
</svelte:head>

<Button {disabled} {loading} on:click={log}>log</Button>
<Layout baby={$baby} days={$days} user={$user} />

<ReloadPrompt />
