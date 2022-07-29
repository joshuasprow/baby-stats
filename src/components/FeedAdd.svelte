<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addFeed,
    isFeedAdd,
    type FeedKind,
    type FeedSide,
  } from "../stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  let amount = 1;
  let kind: FeedKind = "bottle";
  let side: FeedSide | null = null;

  $: if (kind === "bottle") {
    side = null;
  }
  $: if (kind === "breast" && side === null) {
    side = "L";
  }

  const onAdd = () => {
    const feed = { amount, kind, side };

    if (!isFeedAdd(feed)) {
      console.error("invalid feed", feed);
      return;
    }

    addFeed(feed);
  };
</script>

<EntryModal icon="🍼" okText="add" onOk={onAdd}>
  <article>
    <FeedAmountInput bind:amount />
  </article>

  <article>
    kind:
    <FeedKindInput bind:kind />
  </article>

  <article>
    side:
    <FeedSideInput bind:side disabled={kind === "bottle"} />
  </article>
</EntryModal>
