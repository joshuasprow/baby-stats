<script lang="ts">
  import type { Log } from "@baby-stats/models/logs";

  export let error: NonNullable<Log["error"]>;

  $: stack = error?.stack;
</script>

<span class="log-error">
  <span class="message">{error.message}</span>
  <span class="stack">{stack}</span>
</span>

<style>
  .log-error {
    display: flex;
    flex-direction: column;
  }

  .log-error > .message {
    color: var(--error-color-dark);
    font-weight: bold;
  }

  .log-error > .stack {
    white-space: pre;
  }
</style>
