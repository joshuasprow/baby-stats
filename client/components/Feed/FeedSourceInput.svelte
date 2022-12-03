<script lang="ts">
  import type { FeedSource } from "@baby-stats/models/feeds";
  import { createEventDispatcher } from "svelte";

  export let loading: boolean;
  export let source: FeedSource = "bottle";

  const dispatch = createEventDispatcher<{ change: FeedSource }>();

  $: {
    dispatch("change", source);
  }
</script>

<input
  bind:group={source}
  disabled={loading}
  type="radio"
  id="bottle"
  name="source"
  value="bottle"
/>
<label class:loading for="bottle">bottle</label>

<input
  bind:group={source}
  disabled={loading}
  type="radio"
  id="breast"
  name="source"
  value="breast"
/>
<label class:loading for="breast">breast</label>

<style>
  .loading {
    color: #ddd;
  }
</style>
