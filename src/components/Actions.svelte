<script lang="ts">
  import { newTimestampWithPickerDate } from "../stores/picker-date";
  import { addNap } from "../stores/naps";
  import { addPee } from "../stores/pees";
  import { addPoop } from "../stores/poops";
  import FeedAdd from "./FeedAdd.svelte";
</script>

<section>
  <span>actions:</span>

  <FeedAdd />

  <button on:click={() => addNap({ timestamp: newTimestampWithPickerDate() })}>
    💤
  </button>

  <button on:click={() => addPee({ timestamp: newTimestampWithPickerDate() })}>
    💧
  </button>

  <button on:click={() => addPoop({ timestamp: newTimestampWithPickerDate() })}>
    💩
  </button>
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
