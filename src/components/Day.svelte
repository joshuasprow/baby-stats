<script lang="ts">
  import type { DayState } from "../stores/days";
  import { removeNap } from "../stores/naps";
  import { removePee } from "../stores/pees";
  import { removePoop } from "../stores/poops";
  import Entries from "./Entries.svelte";
  import Feeds from "./Feeds.svelte";
  import Pees from "./Pees.svelte";

  export let timestamp: string;
  export let day: DayState;

  $: date = new Intl.DateTimeFormat("en-US").format(parseInt(timestamp));
</script>

<section>
  <span class="timestamp">{date}</span>

  <article class="feeds">
    <Feeds feeds={day.feeds} />
  </article>

  <article class="naps">
    <span>naps: {day.naps.length}</span>
    <Entries kind="naps" entries={day.naps} removeEntry={removeNap} />
  </article>

  <article class="pees">
    <span>pees: {day.pees.length}</span>
    <Pees pees={day.pees} />
    <!-- <Entries kind="pees" entries={day.pees} removeEntry={removePee} /> -->
  </article>

  <article class="poops">
    <span>poops: {day.poops.length}</span>
    <Entries kind="poops" entries={day.poops} removeEntry={removePoop} />
  </article>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "ts . .  ."
      "fe na pe po";
    margin-bottom: 1rem;
  }

  article {
    padding-left: 1rem;
  }

  .timestamp {
    grid-area: ts;
  }

  .feeds {
    grid-area: fe;
  }

  .naps {
    grid-area: na;
  }

  .pees {
    grid-area: pe;
  }

  .poops {
    grid-area: po;
  }
</style>
