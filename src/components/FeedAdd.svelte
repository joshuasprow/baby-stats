<script lang="ts">
  import type { FeedSource, FeedSide } from "$stores/feeds";
  import { addFeed } from "$stores/feeds";
  import EntryModal from "./EntryModal.svelte";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedSourceInput from "./FeedSourceInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  let amount = 1;
  let source: FeedSource = "bottle";
  let side: FeedSide | null = null;

  $: if (source === "bottle") {
    side = null;
  }
  $: if (source === "breast" && side === null) {
    side = "L";
  }

  const onAdd = () => addFeed({ amount, source, side });
</script>

<EntryModal icon="🍼" okText="add" onOk={onAdd}>
  <article>
    <FeedAmountInput bind:amount />
  </article>

  <article>
    kind:
    <FeedSourceInput bind:source />
  </article>

  <article>
    side:
    <FeedSideInput bind:side disabled={source === "bottle"} />
  </article>
</EntryModal>
