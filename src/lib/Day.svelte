<script lang="ts">
  import { removeFeed, type DayState } from "./days";
  import Entries from "./Entries.svelte";

  export let day: DayState;
</script>

<section>
  <article>
    <span>feeds: {day.feeds.length}</span>
    <Entries icon="🍼" entries={day.feeds} removeEntry={removeFeed} />
  </article>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
