<script lang="ts">
  import { fade } from "svelte/transition";
  import { removeNap, updateNap, type Nap } from "../stores/naps";
  // import NapAmountInput from "./NapAmountInput.svelte";
  // import NapIcon from "./NapIcon.svelte";

  export let nap: Nap;

  let open = false;
  let amount = nap.amount;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>
  <!-- <NapIcon {nap} /> -->
</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <!-- <NapAmountInput bind:amount /> -->
      </article>

      <button
        on:click={() => {
          updateNap({ amount, timestamp: nap.timestamp });
          setClosed();
        }}
      >
        edit
      </button>
      <button
        on:click={() => {
          removeNap(nap.timestamp);
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
