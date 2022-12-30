<script lang="ts">
  import type { Entry } from "@baby-stats/models/entries";
  import {
    BottleFeed,
    BreastFeed,
    type FeedSource,
  } from "@baby-stats/models/feeds";
  import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
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
  import { getChartDataDocs } from "../../lib/chart";
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
        stacked: true,
      },
      y: {
        display: true,
        stacked: true,
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

  const buildLabels = (feeds: (BottleFeed | BreastFeed)[]) => {
    const labels: string[] = [];

    feeds.forEach((feed) => {
      labels.push(formatTimestamp(feed.timestamp));
    });

    return labels;
  };

  const buildDataset = <S extends FeedSource>(
    source: S,
    feeds: S extends "bottle" ? BottleFeed[] : BreastFeed[],
  ): ChartDataset => {
    const label = source === "bottle" ? "Bottle" : "Breast";

    return {
      label: `${label} Feeds`,
      data: feeds.map(({ amount }) => {
        if (typeof amount === "number") return amount;

        return getTimeRangeDiffInMinutes(amount);
      }),
      backgroundColor: source === "bottle" ? "blue" : "red",
    };
  };

  const updateChartData = async () => {
    try {
      const [bottleDocs, breastDocs] = await Promise.all([
        getChartDataDocs(babyId, "feeds", "bottle"),
        getChartDataDocs(babyId, "feeds", "breast"),
      ]);

      const bottleFeeds = bottleDocs.map((doc) => BottleFeed.parse(doc.data()));
      const breastFeeds = breastDocs.map((doc) => BreastFeed.parse(doc.data()));

      const labels = buildLabels([...bottleFeeds, ...breastFeeds]);

      const bottleDataset = buildDataset("bottle", bottleFeeds);
      const breastDataset = buildDataset("breast", breastFeeds);

      data = { labels, datasets: [bottleDataset, breastDataset] };

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
