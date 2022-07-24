<script lang="ts">
  export let count = 0;

  $: poops = new Array(count).fill("💩");
</script>

<div>
  <p>poops:</p>
  {#each poops as poop}
    <span>{poop}</span>
  {/each}
</div>
