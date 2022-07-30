<script lang="ts">
  import { fly } from "svelte/transition";

  export let icon = "😃";
  export let okText: string;
  export let onOk: () => void;

  export let onRemove: (() => void) | undefined = undefined;

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

    onOk();
  };

  const handleRemove = async () => {
    setClosed();

    if (!onRemove) return;

    await new Promise((resolve) => setTimeout(resolve, duration));

    onRemove();
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
      <slot />

      <button on:click={handleOk}>
        {okText}
      </button>

      {#if onRemove}
        <button on:click={handleRemove}> remove </button>
      {/if}
    </section>
  </aside>
{/if}

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
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
