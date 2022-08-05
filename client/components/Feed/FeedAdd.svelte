<script lang="ts">
  import type { FeedAdd, FeedSide, FeedSource } from "$models/feeds";
  import { addFeed } from "$stores/feeds";
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import FeedAmountInput from "$components/Feed/FeedAmountInput.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";

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

<EntryAddModal on:add={handleAdd} on:timestamp={handleTimestamp} {timestamp}>
  <span slot="icon">🍼</span>

  <article>
    <FeedAmountInput bind:amount {source} />
  </article>

  <article>
    source:
    <FeedSourceInput bind:source />
  </article>

  <FeedSideInputGroup bind:side disabled={source === "bottle"} />
</EntryAddModal>
