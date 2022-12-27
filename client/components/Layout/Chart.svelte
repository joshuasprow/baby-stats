<script lang="ts">
  import { BarChartSimple } from "@carbon/charts-svelte";
  import { ScaleTypes, TruncationTypes } from "@carbon/charts/interfaces";
  import "@carbon/charts/styles.css";
  import "@carbon/styles/css/styles.css";
  import { chart } from "../../stores/chart";

  export let babyId: string;
  export let userId: string;
</script>

<section class="chart-container">
  <BarChartSimple
    data={$chart}
    name="Pee Chart"
    options={{
      title: "Pees",
      height: "400px",
      axes: {
        left: {
          mapsTo: "amount",
        },
        bottom: {
          mapsTo: "timestamp",
          scaleType: ScaleTypes.TIME,
          truncation: { type: TruncationTypes.NONE },
        },
      },
    }}
  />
</section>

<style>
  .chart-container {
    width: 80vw;
    height: 80vh;
  }
</style>
