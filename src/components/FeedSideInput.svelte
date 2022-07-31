<script lang="ts">
  import type { FeedSide } from "$models/feeds";

  export let disabled: boolean;
  export let group: FeedSide | null;
  export let side: FeedSide | null;
  export let label: string;
</script>

<label class:disabled for={side}>
  <input
    bind:group
    {disabled}
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
