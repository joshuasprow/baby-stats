<script lang="ts">
  import type { TimeRangeAmount } from "@baby-stats/models/time";
  import { getTimeRangeDiffInMinutes } from "../../lib/dates";
  import EntryIcon from "../Entry/EntryIcon.svelte";

  export let amount: TimeRangeAmount;

  $: minutes = getTimeRangeDiffInMinutes(amount);
</script>

<EntryIcon>
  <span class="shadowed" slot="left">💤</span>
  <span slot="middle">{minutes}min</span>
</EntryIcon>
