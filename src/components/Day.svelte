<script lang="ts">
  import type { DayState } from "../stores/days";
  import Feeds from "./Feeds.svelte";
  import Naps from "./Naps.svelte";
  import Pees from "./Pees.svelte";
  import Poops from "./Poops.svelte";

  export let timestamp: string;
  export let day: DayState;

  $: date = new Intl.DateTimeFormat("en-US").format(parseInt(timestamp));
</script>

<span class="timestamp">{date}</span>

<section>
  <article class="feeds">
    <Feeds feeds={day.feeds} />
  </article>

  <article class="naps">
    <Naps naps={day.naps} />
  </article>

  <article class="pees">
    <Pees pees={day.pees} />
  </article>

  <article class="poops">
    <Poops poops={day.poops} />
  </article>
</section>

<style>
  section {
    display: flex;
    flex-wrap: wrap;
  }

  .timestamp {
    display: block;
    text-decoration: underline;
  }
</style>
