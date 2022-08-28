<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";

  export let amount: number;

  $: icons = new Array(amount).fill("💩");
</script>

<EntryIcon>
  <span slot="middle">
    {#each icons as icon}
      <span class="shadowed">{icon}</span>
    {/each}
  </span>
</EntryIcon>

<style>
  .shadowed {
    margin: 0 0.1rem;
  }
</style>
