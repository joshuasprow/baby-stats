<script lang="ts" context="module">
  import { ENTRY_ICONS } from "@baby-stats/models/entries";
  import { formatDaystamp, getTimeRangeDiffInMinutes } from "../lib/dates";
  import type { DayEntry } from "../stores/days";
  import Button from "./Button.svelte";
  import Entry from "./Entry/Entry.svelte";
  import EntryModal from "./Entry/EntryModal.svelte";

  const getEntryCounts = (day: DayEntry[]) =>
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
          case "meds":
            counts.meds += entry.amount;
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
        meds: 0,
        naps: 0,
        pees: 0,
        poops: 0,
      },
    );
</script>

<script lang="ts">
  export let day: DayEntry[];
  export let daystamp: number;

  let label = formatDaystamp(daystamp);
  let open = false;

  $: counts = getEntryCounts(day);

  const handleOpenClick = () => {
    open = true;
  };
</script>

<EntryModal bind:open>
  <Button class="day-button" slot="button" {label} on:click={handleOpenClick} />

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
  :global(button.day-button) {
    background-color: hsl(
      var(--button-color-hue),
      var(--button-color-saturation),
      calc(var(--button-color-lightness) + 10%)
    );
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0 0 0.5rem 0;
  }

  article {
    margin-bottom: 0.5rem;
  }
</style>
