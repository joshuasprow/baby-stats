<script lang="ts">
  import type { DayState } from "./days";

  export let day: DayState;
</script>

<div>
  <span>feeds: {day.feeds.length}</span>
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
