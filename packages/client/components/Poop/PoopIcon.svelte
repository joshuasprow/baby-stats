<script lang="ts">
  export let amount: number;

  $: icons = new Array(amount).fill("💩").join("");
</script>

{icons}
