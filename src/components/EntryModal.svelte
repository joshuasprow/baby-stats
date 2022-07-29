<script lang="ts">
  import { fade } from "svelte/transition";

  export let icon = "😃";
  export let okText: string;
  export let onOk: () => void;

  export let onRemove: (() => void) | undefined = undefined;

  let open = false;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
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
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <slot />

      <button
        on:click={() => {
          onOk();
          setClosed();
        }}
      >
        {okText}
      </button>
      {#if onRemove}
        <button
          on:click={() => {
            if (onRemove) onRemove();
            setClosed();
          }}
        >
          remove
        </button>
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
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section {
    color: #000;
    background: #fff;
    padding: 0.5rem;
  }
</style>
