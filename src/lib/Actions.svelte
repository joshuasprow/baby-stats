<script lang="ts">
  import { addFeed } from "./feeds";
  import { addNap } from "./naps";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
</script>

<div>
  <button on:click={addFeed}>🍼</button>
  <button on:click={addNap}>💤</button>
  <button on:click={addPee}>💧</button>
  <button on:click={addPoop}>💩</button>
</div>
