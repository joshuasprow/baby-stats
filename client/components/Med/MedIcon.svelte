<script lang="ts">
  import { ENTRY_ICONS } from "@baby-stats/models/entries";
  import type { MedUnit } from "@baby-stats/models/meds";
  import EntryIcon from "../Entry/EntryIcon.svelte";

  export let amount: number;
  export let unit: MedUnit;
</script>

<EntryIcon>
  <span class="shadowed" slot="left">{ENTRY_ICONS.meds}</span>
  <span class="shadowed" slot="middle">{`${amount}${unit}`}</span>
</EntryIcon>
