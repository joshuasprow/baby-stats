<script lang="ts" context="module">
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
</script>

<script lang="ts">
  import { logs } from "../stores/logs";
</script>

<section class="log-viewer">
  {#each $logs as { id, error, level, message, timestamp } (id)}
    <p>
      <span class="timestamp">{formatter.format(timestamp)}</span>
      <span class={`level ${level}`}>[{level}]</span>
      <span class="message">{message}</span>
      <span class="stack">{error && error.stack ? error.stack : ""}</span>
    </p>
  {/each}
</section>

<style>
  .log-viewer {
    max-height: 100%;
    width: 100%;
    overflow: auto;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
  }

  .log-viewer p {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    margin: 0;
    padding: 0.5rem;
  }

  .log-viewer p:nth-of-type(even) {
    background-color: var(--button-color-hover);
  }

  .log-viewer span {
    white-space: nowrap;
  }

  .log-viewer .level {
    /* [error] is the largest at 7 characters */
    min-width: 7ch;
  }

  .log-viewer .error {
    color: var(--error-color);
  }

  .log-viewer .info {
    color: var(--info-color);
  }

  .log-viewer .warn {
    color: var(--warning-color);
  }

  .log-viewer .stack {
    white-space: normal;
  }
</style>
