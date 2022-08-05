<script lang="ts">
  import type { FeedSide, FeedSource } from "baby-stats-models/feeds";
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import ErrorMessage from "$components/ErrorMessage.svelte";

  export let amount: number;
  export let source: FeedSource;
  export let side: FeedSide | null;
</script>

{#if source === "bottle"}
  <EntryIcon>
    <span slot="left">🍼</span><span slot="middle">{amount}oz</span>
  </EntryIcon>
{:else if source === "breast"}
  <EntryIcon>
    <span slot="left">🤱</span>
    <span slot="middle">{amount * 5}min</span>
    <span slot="right">{side}</span>
  </EntryIcon>
{:else}
  <EntryIcon>
    <ErrorMessage message={`invalid source: ${source}`} slot="middle" />
  </EntryIcon>
{/if}
