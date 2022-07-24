<script lang="ts">
  export let count = 0;

  $: naps = new Array(count).fill("💤");
</script>

<div>
  <p>naps:</p>
  {#each naps as nap}
    <span>{nap}</span>
  {/each}
</div>
