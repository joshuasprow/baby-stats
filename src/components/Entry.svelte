<script lang="ts" context="module">
  import type { Entry, EntryKind } from "$models/entries";
  import type { ComponentType } from "svelte";
  import { slide } from "svelte/transition";
  import FeedUpdate from "./FeedUpdate.svelte";
  import NapUpdate from "./NapUpdate.svelte";
  import PeeUpdate from "./PeeUpdate.svelte";
  import PoopUpdate from "./PoopUpdate.svelte";

  // used to dynamically render the correct component
  const components: {
    [K in EntryKind]: ComponentType;
  } = {
    feeds: FeedUpdate,
    naps: NapUpdate,
    pees: PeeUpdate,
    poops: PoopUpdate,
  } as const;
</script>

<script lang="ts">
  export let entry: Entry<EntryKind>;

  let component = components[entry.kind];
</script>

<div transition:slide>
  <span>{entry.timestamp.toLocaleTimeString()}</span>

  {#if component}
    <svelte:component this={component} {entry} />
  {:else}
    <span>🚫</span>
  {/if}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-left: 0.5rem;
  }
</style>
