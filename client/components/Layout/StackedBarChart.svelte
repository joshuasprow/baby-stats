<script lang="ts">
  import type { Entry } from "@baby-stats/models/entries";
  import { Timestamp } from "@firebase/firestore";
  import type { ChartData, ChartOptions } from "chart.js";
  import {
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from "chart.js";
  import { eachDayOfInterval } from "date-fns";
  import { onMount } from "svelte";
  import { Bar } from "svelte-chartjs";
  import { getChartFeeds } from "../../lib/chart";
  import { getTimeRangeDiffInMinutes } from "../../lib/dates";

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  );

  export let babyId: string;

  let data: ChartData = {
    datasets: [],
  };
  let options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        display: true,
        stacked: "single",
      },
      yBottle: {
        display: true,
        stacked: "single",
        title: {
          display: true,
          text: "Ounces",
        },
      },
      yBreast: {
        display: true,
        stacked: "single",
        position: "right",
        title: {
          display: true,
          text: "Minutes",
        },
      },
    },
  };

  const DOW = new Map([
    [0, "Sun"],
    [1, "Mon"],
    [2, "Tue"],
    [3, "Wed"],
    [4, "Thu"],
    [5, "Fri"],
    [6, "Sat"],
  ]);

  const formatTimestamp = (timestamp: Entry["timestamp"]) => {
    const date = timestamp.toDate();

    const m = date.getMonth() + 1;
    const d = date.getDate();
    const dow = DOW.get(date.getDay());

    return `${dow} ${m}/${d}`;
  };

  const buildDatasets = ({
    dates,
    bottle,
    breast,
  }: Awaited<ReturnType<typeof getChartFeeds>>): ChartData => {
    const labels: string[] = [];

    eachDayOfInterval({
      start: dates.min,
      end: dates.max,
    }).forEach((date) =>
      labels.push(formatTimestamp(Timestamp.fromDate(date))),
    );

    const bottleData: number[] = [];
    const breastData: number[] = [];

    for (const { amount, timestamp } of bottle) {
      const label = formatTimestamp(timestamp);
      const index = labels.indexOf(label);

      if (index === -1) {
        console.error(`Could not find bottle label ${label} in labels`);
        continue;
      }

      const sum = bottleData[index] || 0;

      bottleData[index] = sum + amount;
    }

    for (const { amount, timestamp } of breast) {
      const label = formatTimestamp(timestamp);
      const index = labels.indexOf(label);

      if (index === -1) {
        console.error(`Could not find breast label ${label} in labels`);
        continue;
      }

      const sum = breastData[index] || 0;

      breastData[index] = sum + getTimeRangeDiffInMinutes(amount);
    }

    return {
      labels,
      datasets: [
        {
          label: "Bottle Feeds",
          backgroundColor: "hsla(4, 82%, 56%, 0.5)",
          data: bottleData,
          yAxisID: "yBottle",
        },
        {
          label: "Breast Feeds",
          backgroundColor: "hsla(240, 80%, 56%, 0.5)",
          data: breastData,
          yAxisID: "yBreast",
        },
      ],
    };
  };

  const updateChartData = async () => {
    try {
      const feeds = await getChartFeeds(babyId);

      data = buildDatasets(feeds);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  onMount(() => {
    updateChartData();
  });
</script>

<Bar {data} {options} />
