<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InputEvent } from "../../lib/dom";

  export let name: string;
  export let loading: boolean;

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher<{ change: string }>();

  const handleNameChange = (e: InputEvent) =>
    dispatch("change", e.currentTarget.value);
</script>

<label for="name">
  name:
  <input
    class:loading
    id="name"
    on:change={handleNameChange}
    on:focus={(e) => e.currentTarget.select()}
    bind:value={name}
  />
</label>

<style>
  .loading {
    filter: grayscale(100%);
    cursor: not-allowed;
  }
</style>
