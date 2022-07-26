<script lang="ts">
  import type { FeedKind } from "src/stores/feeds";

  export let kind: FeedKind;
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
