<script lang="ts">
  import {
    ENTRY_KINDS,
    type Entry,
    type EntryKind,
  } from "@baby-stats/models/entries";
  import { Pee } from "@baby-stats/models/pees";
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
  import type { ZodType } from "zod";
  import { getChartData } from "../../lib/chart";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  );

  export let babyId: string;

  let kind: Entry["kind"] = "pees";

  let labels: string[] = [];
  let data: number[] = [];

  const updateChartData = async () => {
    try {
      const result = await getChartData(babyId, kind);

      labels = result.labels;
      data = result.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleKindChange = async (event: Event) => {
    const target = event.target as HTMLSelectElement;

    kind = target.value as EntryKind;

    await updateChartData();
  };

  onMount(() => {
    updateChartData();
  });

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pee Chart",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} ${kind}`,
        },
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: "Pees",
        },
      },
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };
</script>

<section class="chart-container">
  <select on:change={handleKindChange} value={kind}>
    {#each ENTRY_KINDS as k}
      <option value={k} selected={k === kind}>{k}</option>
    {/each}
  </select>

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
