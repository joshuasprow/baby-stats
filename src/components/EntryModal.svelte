<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { fly } from "svelte/transition";
  import DateTimePicker from "./DateTimePicker.svelte";

  export let icon = "😃";

  export let okText: string;
  export let okCallback: () => void;

  export let removeCallback: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher<{ timestamp: Date }>();
  const duration = 300;

  let open = false;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };

  const handleOk = async () => {
    setClosed();

    await new Promise((resolve) => setTimeout(resolve, duration));

    okCallback();
  };

  const handleTimestamp = (e: CustomEvent<Date>) => {
    dispatch("timestamp", e.detail);
  };

  const handleRemove = async () => {
    setClosed();

    if (!removeCallback) return;

    await new Promise((resolve) => setTimeout(resolve, duration));

    removeCallback();
  };
</script>

<button on:click={setOpen}>
  {#if $$slots.icon}
    <slot name="icon" />
  {:else}
    {icon}
  {/if}
</button>

{#if open}
  <aside on:click={setClosed}>
    <section
      on:click|stopPropagation
      transition:fly={{ duration, y: 1000, opacity: 0 }}
    >
      <DateTimePicker on:change={handleTimestamp} />

      <slot />

      <button on:click={handleOk}>
        {okText}
      </button>

      {#if removeCallback}
        <button on:click={handleRemove}> remove </button>
      {/if}
    </section>
  </aside>
{/if}

<style>
  aside {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section {
    color: #000;
    background: #fff;
    border: 1px solid #000;
    padding: 0.5rem;
  }
</style>
