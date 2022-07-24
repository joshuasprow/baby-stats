<script lang="ts">
  import { addFeed } from "./feeds";

  export let addNap: () => void;
  export let addPee: () => void;
  export let addPoop: () => void;
</script>

<div>
  <button on:click={addFeed}>🍼</button>
  <button on:click={addNap}>💤</button>
  <button on:click={addPee}>💧</button>
  <button on:click={addPoop}>💩</button>
</div>
