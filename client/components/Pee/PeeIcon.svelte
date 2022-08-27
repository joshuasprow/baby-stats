<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";

  import type { PeeAmount } from "baby-stats-models/pees";

  export let amount: PeeAmount;

  $: icons = new Array(amount).fill("💧").join("");
</script>

<EntryIcon>
  <span slot="middle">{icons}</span>
</EntryIcon>
