<script lang="ts">
  import type {
    BreastFeedAmount,
    FeedSide,
    FeedSource,
  } from "baby-stats-models/feeds";
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import ErrorMessage from "$components/ErrorMessage.svelte";

  export let amount: number | BreastFeedAmount;
  export let source: FeedSource;
  export let side: FeedSide | null;

  let _amount =
    typeof amount === "number"
      ? amount * 5
      : amount.end.getMinutes() - amount.start.getMinutes();
</script>

{#if source === "bottle"}
  <EntryIcon>
    <span slot="left">🍼</span><span slot="middle">{amount}oz</span>
  </EntryIcon>
{:else if source === "breast"}
  <EntryIcon>
    <span slot="left">🤱</span>
    <span slot="middle">{_amount}min</span>
    <span slot="right">{side}</span>
  </EntryIcon>
{:else}
  <EntryIcon>
    <ErrorMessage message={`invalid source: ${source}`} slot="middle" />
  </EntryIcon>
{/if}
