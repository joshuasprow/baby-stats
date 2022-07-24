<script lang="ts">
  import { addFeed } from "./feeds";
  import { addNap } from "./naps";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
</script>

<div>
  <button on:click={() => addFeed({ timestamp: new Date() })}>🍼</button>
  <button on:click={() => addNap({ timestamp: new Date() })}>💤</button>
  <button on:click={() => addPee({ timestamp: new Date() })}>💧</button>
  <button on:click={() => addPoop({ timestamp: new Date() })}>💩</button>
</div>
