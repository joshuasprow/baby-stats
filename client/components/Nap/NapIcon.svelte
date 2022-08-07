<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import { getTimeRangeDiffInMinutes } from "baby-stats-lib/dates";
  import type { TimeRangeAmount } from "baby-stats-models/time-ranges";

  export let amount: TimeRangeAmount;

  $: minutes = getTimeRangeDiffInMinutes(amount);
</script>

<EntryIcon>
  <span slot="left">💤</span>
  <span slot="middle">{minutes}min</span>
</EntryIcon>
