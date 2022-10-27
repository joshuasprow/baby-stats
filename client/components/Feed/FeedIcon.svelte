<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import ErrorMessage from "$components/ErrorMessage.svelte";
  import { getTimeRangeDiffInMinutes } from "@baby-stats/lib/dates";
  import type { FeedSide, FeedSource } from "models/feeds";
  import type { TimeRangeAmount } from "models/time";

  export let amount: number | TimeRangeAmount;
  export let source: FeedSource;
  export let side: FeedSide | null;

  $: minutes =
    typeof amount === "number" ? "" : getTimeRangeDiffInMinutes(amount);
</script>

{#if source === "bottle"}
  <EntryIcon>
    <span class="shadowed" slot="left">🍼</span><span slot="middle">
      {amount}oz
    </span>
  </EntryIcon>
{:else if source === "breast"}
  <EntryIcon>
    <span class="shadowed" slot="left">🤱</span>
    <span slot="middle">{minutes}min</span>
    <span slot="right">{side}</span>
  </EntryIcon>
{:else}
  <EntryIcon>
    <ErrorMessage message={`invalid source: ${source}`} slot="middle" />
  </EntryIcon>
{/if}
