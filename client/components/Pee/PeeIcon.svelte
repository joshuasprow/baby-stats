<script lang="ts">
  import type { PeeAmount } from "$models/pees";

  export let amount: PeeAmount;

  $: icons = new Array(amount).fill("💧").join("");
</script>

{icons}
