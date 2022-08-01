<script lang="ts">
  import FeedAdd from "./FeedAdd.svelte";
  import NapAdd from "./NapAdd.svelte";
  import PeeAdd from "./PeeAdd.svelte";
  import PoopAdd from "./PoopAdd.svelte";
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
