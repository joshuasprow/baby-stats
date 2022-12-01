<script lang="ts" context="module">
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const formatTimestamp = (timestamp: number) => {
    return formatter.format(new Date(timestamp));
  };

  const formatStack = (error: Log["error"]) => {
    if (!error) return "";

    const { message, stack } = error;

    const _stack = stack
      ? stack
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n")
      : "";

    return `${message}\n${_stack}`;
  };
</script>

<script lang="ts">
  import type { Log } from "@baby-stats/models/logs";
  import LogError from "./LogError.svelte";

  export let log: Log;

  $: timestamp = formatTimestamp(log.timestamp);
  $: stack = formatStack(log.error);

  $: if (stack) {
    console.dir(stack);
  }
</script>

<p>
  <span class="timestamp">{timestamp}</span>
  <span class={`level ${log.level}`}>[{log.level}]</span>
  {#if log.error}
    <LogError error={log.error} />
  {:else}
    <span class="message">{log.message}</span>
  {/if}
</p>

<style>
  p {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    margin: 0;
    padding: 0.5rem;
    overflow-x: scroll;
  }

  p:nth-of-type(even) {
    background-color: var(--button-color-hover);
  }

  span {
    white-space: nowrap;
  }

  .level {
    /* [error] is the largest at 7 characters */
    min-width: 7ch;
  }

  .level.error {
    color: var(--error-color);
  }

  .level.info {
    color: var(--info-color);
  }

  .level.warn {
    color: var(--warning-color);
  }
</style>
