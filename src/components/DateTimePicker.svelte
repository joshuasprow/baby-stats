<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InputEvent } from "$lib/dom";
  import { getDatetimeLocalString } from "$lib/dates";

  export let timestamp = new Date();

  let value = getDatetimeLocalString(timestamp);

  const dispatch = createEventDispatcher<{ change: Date }>();

  const handleInput = (e: InputEvent) => {
    value = e.currentTarget.value;

    dispatch("change", new Date(value));
  };
</script>

<input on:input={handleInput} type="datetime-local" {value} />
