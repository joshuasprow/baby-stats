<script lang="ts">
  import type { FeedSource } from "src/stores/feeds";
  import { createEventDispatcher } from "svelte";

  export let source: FeedSource = "bottle";

  const dispatch = createEventDispatcher<{ change: FeedSource }>();

  $: {
    dispatch("change", source);
  }
</script>

<label for="bottle">
  <input
    bind:group={source}
    type="radio"
    id="bottle"
    name="source"
    value="bottle"
  />
  bottle
</label>

<label for="breast">
  <input
    bind:group={source}
    type="radio"
    id="breast"
    name="source"
    value="breast"
  />
  breast
</label>
