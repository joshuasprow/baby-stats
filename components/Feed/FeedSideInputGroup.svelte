<script lang="ts">
  import FeedSideInput from "$components/Feed/FeedSideInput.svelte";
  import type { FeedSide } from "$models/feeds";
  import { createEventDispatcher } from "svelte";

  export let loading: boolean;
  export let side: FeedSide | null;

  const dispatch = createEventDispatcher<{ change: FeedSide | null }>();

  $: {
    dispatch("change", side);
  }
</script>

<article>
  <span>side:</span>
  <div>
    <FeedSideInput bind:group={side} label="left" {loading} side="L" />
    <FeedSideInput bind:group={side} label="right" {loading} side="R" />
    <FeedSideInput
      bind:group={side}
      label="left -> right"
      {loading}
      side="LR"
    />
    <FeedSideInput
      bind:group={side}
      label="right -> left"
      {loading}
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
