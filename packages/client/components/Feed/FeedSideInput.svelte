<script lang="ts">
  import type { FeedSide } from "$models/feeds";

  export let loading = false;

  export let disabled: boolean;
  export let group: FeedSide | null;
  export let side: FeedSide | null;
  export let label: string;

  $: _disabled = disabled || loading;
</script>

<label class:disabled={_disabled} for={side}>
  <input
    bind:group
    disabled={_disabled}
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
