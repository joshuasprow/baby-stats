<script lang="ts">
  import { addFeed } from "./feeds";
  import { addNap } from "./naps";
  import { addPee } from "./pees";
  import { addPoop } from "./poops";
  import { newDevDate } from "./dev-date";
</script>

<section>
  <span>actions:</span>
  <button on:click={() => addFeed({ kind: "bottle", amount: 1 })}>🍼</button>
  <button on:click={() => addFeed({ kind: "breast", amount: 1, side: "L" })}>
    🤱L
  </button>
  <button on:click={() => addFeed({ kind: "breast", amount: 1, side: "R" })}>
    🤱R
  </button>
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
