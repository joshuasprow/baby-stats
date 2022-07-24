<script lang="ts">
  import { addFeed } from "./feeds";
  import { addNap } from "./naps";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
  import { newDevDate } from "./dev-date";
</script>

<div>
  <button on:click={() => addFeed({ timestamp: newDevDate() })}>🍼</button>
  <button on:click={() => addNap({ timestamp: newDevDate() })}>💤</button>
  <button on:click={() => addPee({ timestamp: newDevDate() })}>💧</button>
  <button on:click={() => addPoop({ timestamp: newDevDate() })}>💩</button>
</div>
