<script lang="ts">
  import { addNap } from "../stores/naps";
  import { newTimestampWithPickerDate } from "../stores/picker-date";
  import { addPoop } from "../stores/poops";
  import FeedAdd from "./FeedAdd.svelte";
  import NapAdd from "./NapAdd.svelte";
  import PeeAdd from "./PeeAdd.svelte";
</script>

<section>
  <span>actions:</span>

  <FeedAdd />
  <NapAdd />
  <PeeAdd />

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
