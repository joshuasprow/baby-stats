<script lang="ts" context="module">
  const getEntryCounts = (day: DayEntry<EntryKind>[]) => {
    const counts = {
      feeds: 0,
      naps: 0,
      pees: 0,
      poops: 0,
    };

    for (const [_, entry] of day) {
      counts[entry.kind]++;
    }

    return counts;
  };
</script>

<script lang="ts">
  import type { DayEntry } from "$stores/days";
  import { formatDaystamp } from "baby-stats-lib/dates";
  import { ENTRY_ICONS, type EntryKind } from "baby-stats-models/entries";
  import Entry from "./Entry/Entry.svelte";
  import EntryModal from "./Entry/EntryModal.svelte";

  export let day: DayEntry<EntryKind>[];
  export let daystamp: number;

  let label = formatDaystamp(daystamp);
  let open = false;

  $: counts = getEntryCounts(day);
</script>

<EntryModal {open}>
  <span class="date" slot="icon">{label}</span>

  <section>
    <p>{label}</p>
    <p>{ENTRY_ICONS.feeds.bottle} {counts.feeds}</p>
    <p>{ENTRY_ICONS.naps} {counts.naps}</p>
    <p>{ENTRY_ICONS.pees} {counts.pees}</p>
    <p>{ENTRY_ICONS.poops} {counts.poops}</p>
  </section>
</EntryModal>

{#each day as [_, entry] (entry.id)}
  <Entry {entry} />
{/each}

<style>
  .date {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #888;
  }

  p {
    margin: 0 0 0.5rem 0;
  }
</style>
