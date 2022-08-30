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
  <PeeAdd {user} />
  <PoopAdd {user} />
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
    height: var(--action-bar-height);
    background-color: #fff;

    border-top: var(--border);
    border-bottom: var(--border);
  }
</style>
