<script lang="ts" context="module">
  import type { Entry, EntryKind } from "@baby-stats/models/entries";
  import type { ComponentType } from "svelte";
  import { fly } from "svelte/transition";
  import FeedUpdate from "../Feed/FeedUpdate.svelte";
  import NapUpdate from "../Nap/NapUpdate.svelte";
  import PeeUpdate from "../Pee/PeeUpdate.svelte";
  import PoopUpdate from "../Poop/PoopUpdate.svelte";

  // used to dynamically render the correct component
  const components: {
    [K in EntryKind]: ComponentType;
  } = {
    feeds: FeedUpdate,
    naps: NapUpdate,
    pees: PeeUpdate,
    poops: PoopUpdate,
  } as const;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
</script>

<script lang="ts">
  export let entry: Entry;

  $: time = formatter.format(entry.timestamp.toDate());
  $: component = components[entry.kind];
</script>

<div transition:fly={{ x: window.innerWidth }}>
  <span class="time">{time}</span>

  {#if component}
    <svelte:component this={component} {entry} />
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
