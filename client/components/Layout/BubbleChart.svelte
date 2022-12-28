<script lang="ts">
  import { Entry } from "@baby-stats/models/entries";
  import { ENTRY_KINDS } from "@baby-stats/models/entries-base";
  import type { Feed } from "@baby-stats/models/feeds";
  import type { ChartOptions } from "chart.js";

  import {
    Chart as ChartJS,
    Legend,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
  } from "chart.js";
  import { onMount } from "svelte";
  import { Bubble } from "svelte-chartjs";
  import {
    getChartData,
    getChartDataDocs,
    getChartOptions,
  } from "../../lib/chart";
  import FeedSourceInput from "../Feed/FeedSourceInput.svelte";

  ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale);

  export let babyId: string;

  type K = $$Generic<Entry["kind"]>;

  let kind = "pees" as K;
  let source = null as K extends "feeds" ? Feed["source"] : null;

  let labels: string[] = [];
  let data: { x: number; y: number; r: number }[] = [];
  let options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const updateChartData = async () => {
    try {
      const docs = await getChartDataDocs(babyId, kind, source);

      data = docs
        .map((doc) => Entry.parse(doc.data()))
        .map(({ kind, amount, timestamp }) => ({
          x: timestamp.toMillis(),
          y: timestamp.toDate().getHours(),
          r: (typeof amount === "number" ? amount : 1) * 3,
        }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleKindChange = async (event: Event) => {
    const target = event.target as HTMLSelectElement;

    kind = target.value as K;

    if (kind === "feeds" && !source) {
      source = "bottle" as typeof source;
    }

    await updateChartData();
  };

  const handleSourceChange = async (event: CustomEvent<Feed["source"]>) => {
    if (kind === "feeds") {
      source = event.detail as typeof source;
    }

    await updateChartData();
  };

  onMount(() => {
    updateChartData();
  });
</script>

<section class="chart-container">
  <select on:change={handleKindChange} value={kind}>
    {#each ENTRY_KINDS as k}
      <option value={k} selected={k === kind}>{k}</option>
    {/each}
  </select>

  {#if kind === "feeds"}
    <FeedSourceInput loading={false} on:change={handleSourceChange} />
  {/if}

  <Bubble
    data={{
      // labels,
      datasets: [{ label: "Pees", data }],
    }}
    {options}
  />
</section>

<style>
  section {
    max-height: 80vh;
  }
</style>
