<script lang="ts">
  import type { FeedSide } from "models/feeds";

  export let group: FeedSide | null;
  export let label: string;
  export let loading: boolean;
  export let side: FeedSide | null;
</script>

<label class:disabled={loading} for={side}>
  <input
    bind:group
    disabled={loading}
    id={side}
    name="side"
    type="radio"
    value={side}
  />
  <span>{label}</span>
</label>

<style>
  .disabled span {
    color: #aaa;
  }
</style>
