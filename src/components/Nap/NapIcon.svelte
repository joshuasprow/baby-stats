<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";

  export let amount: number;
</script>

<EntryIcon>
  <span slot="left">💤</span>
  <span slot="middle">{amount * 15}min</span>
</EntryIcon>
