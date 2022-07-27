<script lang="ts">
  import { fade } from "svelte/transition";
  import { removePoop, updatePoop, type Poop } from "../stores/poops";
  import PoopAmountInput from "./PoopAmountInput.svelte";
  import PoopIcon from "./PoopIcon.svelte";

  export let poop: Poop;

  let open = false;
  let amount = poop.amount;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>
  <PoopIcon {poop} />
</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <PoopAmountInput bind:amount />
      </article>

      <button
        on:click={() => {
          updatePoop({ amount, timestamp: poop.timestamp });
          setClosed();
        }}
      >
        edit
      </button>
      <button
        on:click={() => {
          removePoop(poop.timestamp);
          setClosed();
        }}
      >
        remove
      </button>
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
