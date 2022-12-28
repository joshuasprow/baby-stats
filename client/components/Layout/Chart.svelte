<script lang="ts">
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
  import { getChartData } from "../../lib/chart";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  );

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
          label: (context) => `${context.parsed.y} pees`,
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

  export let babyId: string;

  let labels: string[] = [];
  let data: number[] = [];

  onMount(async () => {
    try {
      const result = await getChartData(babyId, "pees", Pee);

      labels = result.labels;
      data = result.data;
    } catch (error) {
      console.error(error);
    }
  });
</script>

<section class="chart-container">
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
