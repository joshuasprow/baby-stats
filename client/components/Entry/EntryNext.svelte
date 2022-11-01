<script lang="ts" context="module">
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
</script>

<script lang="ts">
  import type { Entry, EntryKind } from "@baby-stats/models/entries";
  import { fly } from "svelte/transition";
  import FeedUpdate from "../Feed/FeedUpdate.svelte";
  import NapUpdate from "../Nap/NapUpdate.svelte";
  import PeeUpdate from "../Pee/PeeUpdate.svelte";
  import PoopUpdate from "../Poop/PoopUpdate.svelte";

  export let entry: Entry<EntryKind>;

  $: time = formatter.format(entry.timestamp.toDate());
</script>

<div transition:fly={{ x: window.innerWidth }}>
  <span class="time">{time}</span>

  {#if entry.kind === "feeds"}
    <FeedUpdate {entry} />
  {:else if entry.kind === "naps"}
    <NapUpdate {entry} />
  {:else if entry.kind === "pees"}
    <PeeUpdate {entry} />
  {:else if entry.kind === "poops"}
    <PoopUpdate {entry} />
  {:else}
    <span>🚫</span>
  {/if}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .time {
    text-align: right;
    margin-right: 0.5rem;
  }
</style>
