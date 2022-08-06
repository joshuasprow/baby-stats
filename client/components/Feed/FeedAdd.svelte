<script lang="ts">
  import EntryAddModal from "$components/Entry/EntryAddModal.svelte";
  import FeedAmountInput from "$components/Feed/FeedAmountInput.svelte";
  import FeedSideInputGroup from "$components/Feed/FeedSideInputGroup.svelte";
  import FeedSourceInput from "$components/Feed/FeedSourceInput.svelte";
  import { addFeed } from "$stores/feeds";
  import type { FeedAdd, FeedSide, FeedSource } from "baby-stats-models/feeds";

  let amount = 2;
  let loading = false;
  let side: FeedSide | null = null;
  let source: FeedSource = "bottle";

  let timestamp: Date;

  $: if (source === "bottle") {
    side = null;
  }
  $: if (source === "breast" && side === null) {
    side = "L";
  }

  const handleTimestamp = (e: CustomEvent<Date>) => {
    timestamp = e.detail;
  };

  const handleAdd = async () => {
    loading = true;

    await addFeed({
      amount,
      kind: "feeds",
      source,
      side,
      timestamp,
    } as FeedAdd);

    loading = false;
  };
</script>

<EntryAddModal
  bind:timestamp
  {loading}
  on:add={handleAdd}
  on:timestamp={handleTimestamp}
>
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
