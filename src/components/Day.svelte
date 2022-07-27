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

<section>
  <span class="timestamp">{date}</span>

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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "ts . .  ."
      "fe na pe po";
    margin-bottom: 1rem;
  }

  article {
    padding-left: 1rem;
  }

  .timestamp {
    grid-area: ts;
  }

  .feeds {
    grid-area: fe;
  }

  .naps {
    grid-area: na;
  }

  .pees {
    grid-area: pe;
  }

  .poops {
    grid-area: po;
  }
</style>
