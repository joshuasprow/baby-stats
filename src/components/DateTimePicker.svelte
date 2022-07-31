<script lang="ts" context="module">
  // https://stackoverflow.com/a/58054216/8340430
  const getDatetimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(now.getTime() - offset);
    return adjustedDate.toISOString().substring(0, 16); // For minute precision
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InputEvent } from "$lib/types";

  let datetimeLocal = getDatetimeLocal();

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleInput = (e: InputEvent) => {
    const value = e.currentTarget.value;

    dispatch("change", new Date(value));
  };
</script>

<input on:input={handleInput} type="datetime-local" value={datetimeLocal} />
