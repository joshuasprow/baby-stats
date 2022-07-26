<script lang="ts">
  import type { FeedKind, FeedSide } from "src/stores/feeds";

  export let kind: FeedKind;
  export let side: FeedSide | undefined = undefined;

  $: disabled = side === undefined || kind !== "breast";
</script>

<label for="L">
  <input
    bind:group={side}
    {disabled}
    id="L"
    name="side"
    type="radio"
    value="L"
  />
  <span>left</span>
</label>

<label for="R">
  <input
    bind:group={side}
    {disabled}
    id="R"
    name="side"
    type="radio"
    value="R"
  />
  <span>right</span>
</label>

<style>
  input:disabled + span {
    color: #aaa;
  }
</style>
