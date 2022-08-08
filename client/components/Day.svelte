<script lang="ts" context="module">
  import type { DayEntry } from "$stores/days";
  import {
    formatDaystamp,
    getTimeRangeDiffInMinutes,
  } from "baby-stats-lib/dates";
  import { ENTRY_ICONS, type EntryKind } from "baby-stats-models/entries";
  import Entry from "./Entry/Entry.svelte";
  import EntryModal from "./Entry/EntryModal.svelte";
  import { fade } from "svelte/transition";

  const getEntryCounts = (day: DayEntry<EntryKind>[]) =>
    day.reduce(
      (counts, [_, entry]) => {
        const { kind } = entry;

        switch (kind) {
          case "feeds":
            if (entry.source === "bottle") {
              counts.feeds.bottle += entry.amount;
            } else {
              counts.feeds.breast += getTimeRangeDiffInMinutes(entry.amount);
            }
            break;
          case "naps":
            counts.naps += getTimeRangeDiffInMinutes(entry.amount);
            break;
          case "pees":
            counts.pees += entry.amount;
            break;
          case "poops":
            counts.poops += entry.amount;
            break;
          default:
            throw new Error(`invalid entry kind: ${kind}`);
        }

        return counts;
      },
      {
        feeds: { bottle: 0, breast: 0 },
        naps: 0,
        pees: 0,
        poops: 0,
      }
    );
</script>

<script lang="ts">
  export let day: DayEntry<EntryKind>[];
  export let daystamp: number;

  let label = formatDaystamp(daystamp);
  let open = false;

  $: counts = getEntryCounts(day);

  const handleOpenClick = () => {
    open = true;
  };
</script>

<EntryModal bind:open>
  <button slot="button" on:click={handleOpenClick} transition:fade>
    {label}
  </button>

  <section>
    <p>{label}</p>
    <p>{ENTRY_ICONS.feeds.bottle} {counts.feeds.bottle}oz</p>
    <p>{ENTRY_ICONS.feeds.breast} {counts.feeds.breast}min</p>
    <p>{ENTRY_ICONS.naps} {counts.naps}min</p>
    <p>{ENTRY_ICONS.pees} {counts.pees}</p>
    <p>{ENTRY_ICONS.poops} {counts.poops}</p>
  </section>
</EntryModal>

<article>
  {#each day as [_, entry] (entry.id)}
    <Entry {entry} />
  {/each}
</article>

<style>
  button {
    background: transparent;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #888;
    padding: 0 0.25rem;
    margin-bottom: 0.5rem;
    border: 1px solid #888;
    border-radius: 0.25rem;
  }

  p {
    margin: 0 0 0.5rem 0;
  }

  article {
    margin-bottom: 0.5rem;
  }
</style>
