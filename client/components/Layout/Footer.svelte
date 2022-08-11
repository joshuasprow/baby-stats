<script lang="ts">
  import FeedAdd from "$components/Feed/FeedAdd.svelte";
  import NapAdd from "$components/Nap/NapAdd.svelte";
  import PeeAdd from "$components/Pee/PeeAdd.svelte";
  import PoopAdd from "$components/Poop/PoopAdd.svelte";
  import type { User } from "baby-stats-models/users";

  export let user: User;
</script>

<footer>
  <FeedAdd {user} />
  <NapAdd {user} />
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
    background-color: buttonface;
  }
</style>
