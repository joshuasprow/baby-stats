<script lang="ts">
  import type { Nap } from "../stores/naps";

  export let nap: Nap;

  $: amount = nap.amount;
</script>

{amount}💤
