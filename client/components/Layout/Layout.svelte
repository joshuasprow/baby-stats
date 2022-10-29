<script lang="ts">
  import type { Baby } from "@baby-stats/models/babies";
  import type { User } from "@baby-stats/models/users";
  import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
  } from "@firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../../firebase";
  import type { Day } from "../../stores/days";
  import Footer from "./Footer.svelte";
  import Main from "./Main.svelte";
  import Sider from "./Sider.svelte";

  export let baby: Baby | undefined | null;
  export let days: Day[] | undefined;
  export let user: User | undefined | null;

  onMount(async () => {
    while (!baby || !user) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const twoDaysAgo = Timestamp.fromDate(
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    );

    const ref = query(
      collection(db, "entries"),
      where("babyId", "==", baby.id),
      where("timestamp", ">=", twoDaysAgo),
    );
    const snapshot = await getDocs(ref);

    snapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  });
</script>

{#if user}
  <Sider />
{/if}

<Main {baby} {days} {user} />

{#if baby && user}
  <Footer babyId={baby.id} userId={user.uid} />
{/if}
