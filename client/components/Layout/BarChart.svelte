<script lang="ts">
  import type { Entry } from "@baby-stats/models/entries";
  import { ENTRY_KINDS } from "@baby-stats/models/entries-base";
  import type { Feed } from "@baby-stats/models/feeds";
  import type { ChartOptions } from "chart.js";
  import {
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from "chart.js";
  import { onMount } from "svelte";
  import { Bar } from "svelte-chartjs";
  import { getChartData, getChartOptions } from "../../lib/chart";
  import FeedSourceInput from "../Feed/FeedSourceInput.svelte";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  );

  export let babyId: string;

  type K = $$Generic<Entry["kind"]>;

  let kind = "pees" as K;
  let source = null as K extends "feeds" ? Feed["source"] : null;

  let labels: string[] = [];
  let data: number[] = [];
  let options: ChartOptions = {};

  const updateChartData = async () => {
    try {
      const result = await getChartData(babyId, kind, source);

      labels = result.labels;
      data = result.data;
      options = getChartOptions(kind, source);
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

  <Bar
    data={{
      labels,
      datasets: [
        {
          label: "Pees",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    }}
    {options}
  />
</section>
