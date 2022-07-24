<script lang="ts">
  import type { DayState } from "./days";
  import Entries from "./Entries.svelte";
  import { removeFeed } from "./feeds";
  import { removeNap } from "./naps";
  import { removePee } from "./pees";
  import { removePoop } from "./poops";

  export let timestamp: string;
  export let day: DayState;

  $: date = new Intl.DateTimeFormat("en-US").format(parseInt(timestamp));
</script>

<section>
  <span class="timestamp">{date}</span>

  <article class="feeds">
    <span>feeds: {day.feeds.length}</span>
    <span>bottle: {day.feeds.filter((f) => f.kind === "bottle").length}</span>
    <span>breast: {day.feeds.filter((f) => f.kind === "breast").length}</span>
    <Entries kind="feeds" entries={day.feeds} removeEntry={removeFeed} />
  </article>

  <article class="naps">
    <span>naps: {day.naps.length}</span>
    <Entries kind="naps" entries={day.naps} removeEntry={removeNap} />
  </article>

  <article class="pees">
    <span>pees: {day.pees.length}</span>
    <Entries kind="pees" entries={day.pees} removeEntry={removePee} />
  </article>

  <article class="poops">
    <span>poops: {day.poops.length}</span>
    <Entries kind="poops" entries={day.poops} removeEntry={removePoop} />
  </article>
</section>

<style>
  section {
    display: grid;
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
