<script lang="ts">
  import type { PeeAmount } from "@baby-stats/models/pees";
  import EntryIcon from "../Entry/EntryIcon.svelte";

  export let amount: PeeAmount;

  $: icons = new Array(amount).fill("💧").join("");
</script>

<EntryIcon>
  <span class="shadowed" slot="middle">{icons}</span>
</EntryIcon>
