<script lang="ts">
  import Footer from "$components/Layout/Footer.svelte";
  import Sider from "$components/Layout/Sider.svelte";
  import type { Baby } from "@baby-stats/models/babies";
  import type { User } from "@baby-stats/models/users";
  import type { Day } from "$stores/days";
  import Main from "./Main.svelte";

  export let baby: Baby | undefined | null;
  export let days: Day[] | undefined;
  export let user: User | undefined | null;
</script>

{#if user}
  <Sider />
{/if}

<Main {baby} {days} {user} />

{#if baby}
  <Footer babyId={baby.id} />
{/if}
