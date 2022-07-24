<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import Entries from "./lib/Entries.svelte";
  import { feeds, removeFeed } from "./lib/feeds";
  import { naps, removeNap } from "./lib/naps";
  import { pees, removePee } from "./lib/pees";
  import { poops, removePoop } from "./lib/poops";
</script>

<main>
  <Actions />
  <section class="entries">
    <Entries entries={$feeds} icon="🍼" kind="feed" removeEntry={removeFeed} />
    <Entries entries={$naps} icon="💤" kind="nap" removeEntry={removeNap} />
    <Entries entries={$pees} icon="💧" kind="pee" removeEntry={removePee} />
    <Entries entries={$poops} icon="💩" kind="poop" removeEntry={removePoop} />
  </section>
</main>

<style>
  main {
    width: 100%;
  }
  .entries {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
