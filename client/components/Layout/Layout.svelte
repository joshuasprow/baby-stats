<script lang="ts">
  import type { Baby } from "@baby-stats/models/babies";
  import type { Entry, EntryKind } from "@baby-stats/models/entries";
  import type { User } from "@baby-stats/models/users";
  import { onMount } from "svelte";
  import { db } from "../../firebase";
  import { subscribeToEntries } from "../../firebase/entries";
  import {
    encodeDayTimestamp,
    newDayEntry,
    type Day as DayType,
  } from "../../stores/days";
  import Footer from "./Footer.svelte";
  import Main from "./Main.svelte";
  import Sider from "./Sider.svelte";

  export let baby: Baby | undefined | null;
  export let days: DayType[] | undefined;
  export let user: User | undefined | null;

  let entries: Entry<EntryKind>[] = [];

  onMount(async () => {
    while (!baby || !user) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const set = (e: Entry<EntryKind>[]) => {
      entries = e;

      const _days: DayType[] = [];

      for (const entry of e) {
        const daystamp = encodeDayTimestamp(entry.timestamp);
        const dayEntry = newDayEntry(entry);

        const day = _days.find(([ds]) => ds === daystamp);

        if (day) {
          day[1].push(dayEntry);
          _days[daystamp] = day;
          continue;
        }

        _days.push([daystamp, [dayEntry]]);
      }

      console.log(_days);

      days = [..._days];
    };

    subscribeToEntries(db, baby.id, set);
  });
</script>

{#if user}
  <Sider />
{/if}

<Main {baby} {days} {user} />

{#if baby && user}
  <Footer babyId={baby.id} userId={user.uid} />
{/if}
