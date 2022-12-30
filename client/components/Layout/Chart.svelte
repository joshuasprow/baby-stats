<script lang="ts">
  import BarChart from "./BarChart.svelte";
  import BubbleChart from "./BubbleChart.svelte";
  import StackedBarChart from "./StackedBarChart.svelte";

  export let babyId: string;

  let chart = "bar" as "bar" | "bubble" | "stackedBar";
</script>

{#if chart === "bar"}
  <BarChart {babyId} />
{:else if chart === "bubble"}
  <BubbleChart {babyId} />
{:else if chart === "stackedBar"}
  <StackedBarChart {babyId} />
{/if}

<menu>
  <button on:click={() => (chart = "bar")}>Bar</button>
  <button on:click={() => (chart = "bubble")}>Bubble</button>
  <button on:click={() => (chart = "stackedBar")}>Stacked Bar</button>
</menu>
