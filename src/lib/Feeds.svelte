<script lang="ts">
  import Entries from "./Entries.svelte";
  import { removeFeed, type Feed, type FeedKind } from "./feeds";

  export let feeds: Feed<FeedKind>[];
</script>

<span>feeds: {feeds.length}</span>
<span>bottle: {feeds.filter((f) => f.kind === "bottle").length}</span>
<span>breast: {feeds.filter((f) => f.kind === "breast").length}</span>
<Entries kind="feeds" entries={feeds} removeEntry={removeFeed} />

<style>
  span {
    display: block;
  }
</style>
