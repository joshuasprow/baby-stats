<script lang="ts">
  import { addFeed, addNap } from "./days";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
</script>

<div>
  <button on:click={() => addFeed({ timestamp: new Date() })}>🍼</button>
  <button on:click={() => addNap({ timestamp: new Date() })}>💤</button>
  <button on:click={addPee}>💧</button>
  <button on:click={addPoop}>💩</button>
</div>
