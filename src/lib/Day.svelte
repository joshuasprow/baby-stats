<script lang="ts">
  import {
    removeFeed,
    removeNap,
    removePee,
    removePoop,
    type DayState,
  } from "./days";
  import Entries from "./Entries.svelte";

  export let day: DayState;
</script>

<section>
  <article>
    <span>feeds: {day.feeds.length}</span>
    <Entries icon="🍼" entries={day.feeds} removeEntry={removeFeed} />
  </article>

  <article>
    <span>naps: {day.naps.length}</span>
    <Entries icon="💤" entries={day.naps} removeEntry={removeNap} />
  </article>

  <article>
    <span>pees: {day.pees.length}</span>
    <Entries icon="💧" entries={day.pees} removeEntry={removePee} />
  </article>

  <article>
    <span>poops: {day.poops.length}</span>
    <Entries icon="💩" entries={day.poops} removeEntry={removePoop} />
  </article>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
