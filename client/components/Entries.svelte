<script lang="ts">
  import Day from "$components/Day.svelte";
  import { days } from "$stores/days";
  import type { User } from "baby-stats-models/users";

  export let user: User;
</script>

{#each $days as [daystamp, day] (daystamp)}
  <Day {daystamp} {day} {user} />
{/each}
