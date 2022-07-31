<script lang="ts">
  import type { FeedAdd, FeedSide, FeedSource } from "$stores/feeds";
  import { addFeed } from "$stores/feeds";
  import EntryAddModal from "./EntryAddModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  let amount = 1;
  let side: FeedSide | null = null;
  let source: FeedSource = "bottle";
  let timestamp = new Date();

  $: if (source === "bottle") {
    side = null;
  }
  $: if (source === "breast" && side === null) {
    side = "L";
  }

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = () =>
    addFeed({ amount, kind: "feeds", source, side, timestamp } as FeedAdd);
</script>

<EntryAddModal on:add={handleAdd} on:timestamp={handleTimestamp}>
  <span slot="icon">🍼</span>

  <article>
    <FeedAmountInput bind:amount />
  </article>

  <article>
    source:
    <FeedSourceInput bind:source />
  </article>

  <article>
    side:
    <FeedSideInput bind:side disabled={source === "bottle"} />
  </article>
</EntryAddModal>
