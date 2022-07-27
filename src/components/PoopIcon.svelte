<script lang="ts">
  import type { Poop } from "../stores/poops";

  export let poop: Poop;

  $: amount = poop.amount;
</script>

{amount}💩
