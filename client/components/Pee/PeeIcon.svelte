<script lang="ts">
  import type { PeeAmount } from "baby-stats-models/pees";

  export let amount: PeeAmount;

  $: icons = new Array(amount).fill("💧").join("");
</script>

{icons}
