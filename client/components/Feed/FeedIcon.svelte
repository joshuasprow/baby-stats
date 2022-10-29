<script lang="ts">
  import type { FeedSide, FeedSource } from "@baby-stats/models/feeds";
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { getTimeRangeDiffInMinutes } from "../../lib/dates";
  import EntryIcon from "../Entry/EntryIcon.svelte";
  import ErrorMessage from "../ErrorMessage.svelte";

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
