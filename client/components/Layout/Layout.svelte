<script lang="ts">
  import type { Baby } from "@baby-stats/models/babies";
  import type { User } from "@baby-stats/models/users";
  import logger from "../../firebase/logger";
  import type { Day } from "../../stores/days";
  import Footer from "./Footer.svelte";
  import Main from "./Main.svelte";
  import Sider from "./Sider.svelte";

  export let baby: Baby | undefined | null;
  export let days: Day[] | undefined;
  export let user: User | undefined | null;

  const log = () => logger.error(new Error("test error"));
</script>

{#if user}
  <Sider />
{/if}

<button on:click={log}>log</button>

<Main {baby} {days} {user} />

{#if baby && user}
  <Footer babyId={baby.id} userId={user.uid} />
{/if}
