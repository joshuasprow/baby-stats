<script lang="ts" context="module">
  // used to dynamically render the correct component
  const components: {
    [K in Kind]: ComponentType;
  } = {
    feeds: FeedUpdate,
    naps: NapUpdate,
    pees: PeeUpdate,
    poops: PoopUpdate,
  } as const;
</script>

<script lang="ts">
  import type { Entry } from "$lib/entry";
  import type { Kind } from "$lib/kind";
  import type { ComponentType } from "svelte";
  import FeedUpdate from "./FeedUpdate.svelte";
  import NapUpdate from "./NapUpdate.svelte";
  import PeeUpdate from "./PeeUpdate.svelte";
  import PoopUpdate from "./PoopUpdate.svelte";

  type K = $$Generic<Kind>;

  export let timestamp: number;
  export let entry: Entry<K>;

  // none of the update components accept a kind prop
  let { kind, ...props } = entry;

  let component = components[kind];
</script>

<div>
  <span>{new Date(timestamp).toLocaleTimeString()}</span>

  {#if component}
    <svelte:component this={component} {...props} />
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
