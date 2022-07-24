<script lang="ts">
  import { addFeed, addNap, addPee, addPoop } from "./days";
</script>

<div>
  <button on:click={() => addFeed({ timestamp: new Date() })}>🍼</button>
  <button on:click={() => addNap({ timestamp: new Date() })}>💤</button>
  <button on:click={() => addPee({ timestamp: new Date() })}>💧</button>
  <button on:click={() => addPoop({ timestamp: new Date() })}>💩</button>
</div>
