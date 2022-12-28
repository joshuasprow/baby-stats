<script lang="ts">
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
  import { Bar } from "svelte-chartjs";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  );

  import { chart } from "../../stores/chart";

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

  $: labels = $chart.reduce(
    (_labels, { group }) => [...Array.from(new Set(_labels).add(group))],
    [] as string[],
  );
  $: labelIndexes = labels.reduce(
    (map, label, index) => ({ ...map, [label]: index }),
    {} as Record<string, number>,
  );
  $: data = $chart.reduce(
    (_data, { group, amount }) => {
      _data[labelIndexes[group]] += amount;

      return _data;
    },
    labels.map((_) => 0),
  );
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
