<script lang="ts">
  import { logs } from "../stores/logs";
</script>

<section>
  {#each $logs as log (log.id)}
    <p>{log.message}</p>
  {/each}
</section>
