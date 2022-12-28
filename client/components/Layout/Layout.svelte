<script lang="ts">
  import type { Baby } from "@baby-stats/models/babies";
  import type { User } from "@baby-stats/models/users";
  import type { Day } from "../../stores/days";
  import Chart from "./Chart.svelte";
  import Footer from "./Footer.svelte";
  // import Main from "./Main.svelte";
  import Sider from "./Sider.svelte";

  export let baby: Baby | undefined | null;
  export let days: Day[] | undefined;
  export let user: User | undefined | null;
</script>

<!-- <Main {baby} {days} {user} /> -->
<Chart />

{#if baby && user}
  <Footer babyId={baby.id} userId={user.uid} />
{/if}

<Sider />
