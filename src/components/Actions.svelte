<script lang="ts">
  import { newDevDate } from "../lib/dev-date";
  import { addNap } from "../lib/naps";
  import { addPee } from "../lib/pees";
  import { addPoop } from "../lib/poops";
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
