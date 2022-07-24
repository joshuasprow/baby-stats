<script lang="ts">
  import { removeFeed, type DayState } from "./days";
  import Entries from "./Entries.svelte";

  export let day: DayState;
</script>

<div>
  <span>feeds: {day.feeds.length}</span>
  <Entries kind="feed" icon="🍼" entries={day.feeds} removeEntry={removeFeed} />
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
