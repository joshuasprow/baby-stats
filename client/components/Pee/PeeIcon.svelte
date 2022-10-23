<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";
  import type { PeeAmount } from "$models/pees";

  export let amount: PeeAmount;

  $: icons = new Array(amount).fill("💧").join("");
</script>

<EntryIcon>
  <span class="shadowed" slot="middle">{icons}</span>
</EntryIcon>
