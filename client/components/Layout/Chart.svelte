<script lang="ts">
  import BarChart from "./BarChart.svelte";
  import BubbleChart from "./BubbleChart.svelte";

  export let babyId: string;

  let chart = "bar" as "bar" | "bubble";
</script>

{#if chart === "bar"}
  <BarChart {babyId} />
{:else if chart === "bubble"}
  <BubbleChart {babyId} />
{/if}

<menu>
  <button on:click={() => (chart = "bar")}>Bar</button>
  <button on:click={() => (chart = "bubble")}>Bubble</button>
</menu>
