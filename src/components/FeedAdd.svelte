<script lang="ts">
  import type { FeedAdd, FeedSide, FeedSource } from "$stores/feeds";
  import { addFeed } from "$stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";

  let amount = 1;
  let source: FeedSource = "bottle";
  let side: FeedSide | null = null;
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

<EntryModal
  icon="🍼"
  okText="add"
  okCallback={handleAdd}
  on:timestamp={handleTimestamp}
>
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
</EntryModal>
