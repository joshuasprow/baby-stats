<script lang="ts">
  import type { FeedKind } from "src/stores/feeds.types";
  import { createEventDispatcher } from "svelte";

  export let kind: FeedKind = "bottle";

  const dispatch = createEventDispatcher<{ change: FeedKind }>();

  $: {
    dispatch("change", kind);
  }
</script>

<label for="bottle">
  <input
    bind:group={kind}
    type="radio"
    id="bottle"
    name="kind"
    value="bottle"
  />
  bottle
</label>

<label for="breast">
  <input
    bind:group={kind}
    type="radio"
    id="breast"
    name="kind"
    value="breast"
  />
  breast
</label>
