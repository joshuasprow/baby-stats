<script lang="ts">
  import type { FeedSide } from "$models/feeds";
  import { createEventDispatcher } from "svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  export let disabled = false;
  export let side: FeedSide | null;

  const dispatch = createEventDispatcher<{ change: FeedSide | null }>();

  $: {
    dispatch("change", side);
  }
</script>

<article>
  <span>side:</span>
  <div>
    <FeedSideInput {disabled} bind:group={side} label="left" side="L" />
    <FeedSideInput {disabled} bind:group={side} label="right" side="R" />
    <FeedSideInput
      {disabled}
      bind:group={side}
      label="left -> right"
      side="LR"
    />
    <FeedSideInput
      {disabled}
      bind:group={side}
      label="right -> left"
      side="RL"
    />
  </div>
</article>

<style>
  article {
    display: flex;
  }

  article > span {
    margin-right: 0.5rem;
  }

  div {
    display: flex;
    flex-direction: column;
  }
</style>
