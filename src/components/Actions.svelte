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
    bottom: 0;
    bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: var(--footer-height);
  }
</style>
