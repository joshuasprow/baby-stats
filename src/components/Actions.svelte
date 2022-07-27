<script lang="ts">
  import FeedAdd from "./FeedAdd.svelte";
  import NapAdd from "./NapAdd.svelte";
  import PeeAdd from "./PeeAdd.svelte";
  import PoopAdd from "./PoopAdd.svelte";
</script>

<section>
  <span>actions:</span>

  <FeedAdd />
  <NapAdd />
  <PeeAdd />
  <PoopAdd />
</section>

<style>
  section {
    margin-bottom: 1rem;
  }

  span {
    display: block;
    text-decoration: underline;
  }
</style>
