<script lang="ts">
  import type { DayState } from "./days";
  import Entries from "./Entries.svelte";
  import { removeFeed } from "./feeds";
  import { removeNap } from "./naps";
  import { removePee } from "./pees";
  import { removePoop } from "./poops";

  export let timestamp: string;
  export let day: DayState;

  let date = new Intl.DateTimeFormat("en-US").format(parseInt(timestamp));
</script>

<section>
  <span class="timestamp">{date}</span>

  <article class="feeds">
    <span>feeds: {day.feeds.length}</span>
    <Entries icon="🍼" entries={day.feeds} removeEntry={removeFeed} />
  </article>

  <article class="naps">
    <span>naps: {day.naps.length}</span>
    <Entries icon="💤" entries={day.naps} removeEntry={removeNap} />
  </article>

  <article class="pees">
    <span>pees: {day.pees.length}</span>
    <Entries icon="💧" entries={day.pees} removeEntry={removePee} />
  </article>

  <article class="poops">
    <span>poops: {day.poops.length}</span>
    <Entries icon="💩" entries={day.poops} removeEntry={removePoop} />
  </article>
</section>

<style>
  section {
    display: grid;
    grid-template-areas:
      "t . .  ."
      "f n pe po";
    margin-bottom: 1rem;
  }

  article {
    padding-left: 1rem;
  }

  .timestamp {
    grid-area: t;
  }

  .feeds {
    grid-area: f;
  }

  .naps {
    grid-area: n;
  }

  .pees {
    grid-area: pe;
  }

  .poops {
    grid-area: po;
  }
</style>
