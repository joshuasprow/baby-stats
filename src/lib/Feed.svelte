<script lang="ts">
  import FeedEdit from "./FeedEdit.svelte";
  import type { Feed, FeedKind } from "./feeds";

  type K = $$Generic<FeedKind>;

  export let feed: Feed<K>;
</script>

<FeedEdit {feed} />
