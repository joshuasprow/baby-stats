<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import Entries from "./lib/Entries.svelte";
  import { feeds, removeFeed } from "./lib/feeds";
  import { naps, removeNap } from "./lib/naps";
  import Pees from "./lib/Pees.svelte";
  import Poops from "./lib/Poops.svelte";

  let pees = 0;
  let poops = 0;

  const addPee = () => {
    pees++;
  };
  const addPoop = () => {
    poops++;
  };
</script>

<main>
  <Actions {addPee} {addPoop} />
  <Entries entries={$feeds} icon="🍼" kind="feed" removeEntry={removeFeed} />
  <Entries entries={$naps} icon="💤" kind="nap" removeEntry={removeNap} />
  <Pees count={pees} />
  <Poops count={poops} />
</main>
