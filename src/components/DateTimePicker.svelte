<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InputEvent } from "$lib/types";
  import { getDatetimeLocalString } from "$lib/dates";

  let datetimeLocal = getDatetimeLocalString();

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleInput = (e: InputEvent) => {
    const value = e.currentTarget.value;

    dispatch("change", new Date(value));
  };
</script>

<input on:input={handleInput} type="datetime-local" value={datetimeLocal} />
