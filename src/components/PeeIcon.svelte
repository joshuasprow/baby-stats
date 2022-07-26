<script lang="ts">
  import type { Pee } from "../stores/pees";

  export let pee: Pee;

  $: amount = pee.amount;
</script>

{amount}💧
