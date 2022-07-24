<script lang="ts">
  import { addFeed } from "./feeds";
  import { addNap } from "./naps";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
  import { newDevDate } from "./dev-date";
  import FeedAdd from "./FeedAdd.svelte";
</script>

<section>
  <span>actions:</span>
  <FeedAdd />
  |
  <button on:click={() => addNap({ timestamp: newDevDate() })}>💤</button>
  |
  <button on:click={() => addPee({ timestamp: newDevDate() })}>💧</button>
  |
  <button on:click={() => addPoop({ timestamp: newDevDate() })}>💩</button>
</section>

<style>
  section {
    margin-bottom: 1rem;
  }

  span {
    display: block;
    text-decoration: underline;
  }
</style>
