<script lang="ts">
  import { ENTRY_ICONS } from "@baby-stats/models/entries-base";
  import type { MedUnit } from "@baby-stats/models/meds";
  import EntryIcon from "../Entry/EntryIcon.svelte";

  export let amount: number;
  export let name: string;
  export let unit: MedUnit;
</script>

<EntryIcon>
  <span class="shadowed" slot="left">{ENTRY_ICONS.meds}</span>
  <span slot="middle">{name}</span>
  <span slot="right">{`${amount}${unit}`}</span>
</EntryIcon>
