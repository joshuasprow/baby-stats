<script lang="ts">
  import EntryIcon from "$components/Entry/EntryIcon.svelte";

  export let amount: number;

  $: icons = new Array(amount).fill("💩").join("");
</script>

<EntryIcon>
  <span slot="middle">{icons}</span>
</EntryIcon>
