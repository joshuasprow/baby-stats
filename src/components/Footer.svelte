<script lang="ts">
  import FeedAdd from "$components/Feed/FeedAdd.svelte";
  import NapAdd from "$components/Nap/NapAdd.svelte";
  import PeeAdd from "$components/PeeAdd.svelte";
  import PoopAdd from "$components/PoopAdd.svelte";
</script>

<footer>
  <FeedAdd />
  <NapAdd />
  <PeeAdd />
  <PoopAdd />
</footer>

<style>
  footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--action-bar-height);
    padding: 0 0.25rem;
    background: var(--action-bar-color);
  }
</style>
