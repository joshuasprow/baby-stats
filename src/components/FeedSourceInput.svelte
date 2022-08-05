<script lang="ts">
  import type { FeedSource } from "$models/feeds";
  import { createEventDispatcher } from "svelte";

  export let loading = false;
  export let source: FeedSource = "bottle";

  const dispatch = createEventDispatcher<{ change: FeedSource }>();

  $: {
    dispatch("change", source);
  }
</script>

<label class:loading for="bottle">
  <input
    bind:group={source}
    disabled={loading}
    type="radio"
    id="bottle"
    name="source"
    value="bottle"
  />
  bottle
</label>

<label class:loading for="breast">
  <input
    bind:group={source}
    disabled={loading}
    type="radio"
    id="breast"
    name="source"
    value="breast"
  />
  breast
</label>

<style>
  .loading {
    color: #ddd;
  }
</style>
