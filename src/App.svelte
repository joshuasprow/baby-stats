<script lang="ts">
  import Actions from "./lib/Actions.svelte";
  import Entries from "./lib/Entries.svelte";
  import Feeds from "./lib/Feeds.svelte";
  import Naps from "./lib/Naps.svelte";
  import { feeds, removeFeed } from "./lib/feeds";
  import Pees from "./lib/Pees.svelte";
  import Poops from "./lib/Poops.svelte";

  let naps = 0;
  let pees = 0;
  let poops = 0;

  const addNap = () => {
    naps++;
  };
  const addPee = () => {
    pees++;
  };
  const addPoop = () => {
    poops++;
  };
</script>

<main>
  <Actions {addNap} {addPee} {addPoop} />
  <Entries entries={$feeds} icon="🍼" kind="feed" removeEntry={removeFeed} />
  <Naps count={naps} />
  <Pees count={pees} />
  <Poops count={poops} />
</main>
