<script lang="ts">
  export let count = 0;

  $: pees = new Array(count).fill("💧");
</script>

<div>
  <p>pees:</p>
  {#each pees as pee}
    <span>{pee}</span>
  {/each}
</div>
