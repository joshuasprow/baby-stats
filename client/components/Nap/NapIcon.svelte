<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import { getTimeRangeDiffInMinutes } from "baby-stats-lib/dates";
  import type { TimeRangeAmount } from "models/time";

  export let amount: TimeRangeAmount;

  $: minutes = getTimeRangeDiffInMinutes(amount);
</script>

<EntryIcon>
  <span class="shadowed" slot="left">💤</span>
  <span slot="middle">{minutes}min</span>
</EntryIcon>
