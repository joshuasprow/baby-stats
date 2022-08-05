<script lang="ts" context="module">
  import type { Entry, EntryKind } from "$models/entries";
  import type { ComponentType } from "svelte";
  import { slide } from "svelte/transition";
  import FeedUpdate from "$components/Feed/FeedUpdate.svelte";
  import NapUpdate from "$components/NapUpdate.svelte";
  import PeeUpdate from "$components/PeeUpdate.svelte";
  import PoopUpdate from "$components/PoopUpdate.svelte";

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
  export let entry: Entry<EntryKind>;

  $: time = formatter.format(entry.timestamp);
  $: component = components[entry.kind];
</script>

<div transition:slide>
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
    align-items: center;
  }

  .time {
    text-align: right;
    margin-right: 0.5rem;
  }
</style>
