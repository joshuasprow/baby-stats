<script lang="ts">
  import { logs } from "../stores/logs";
  import Log from "./Log.svelte";
</script>

<section class="log-viewer">
  {#each $logs as log (log.id)}
    <Log {log} />
  {/each}
</section>

<style>
  .log-viewer {
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
  }
</style>
