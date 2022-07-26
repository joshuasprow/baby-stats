<script lang="ts">
  import { fade } from "svelte/transition";
  import { removePee, updatePee, type Pee } from "../stores/pees";
  import PeeAmountInput from "./PeeAmountInput.svelte";
  import PeeIcon from "./PeeIcon.svelte";

  export let pee: Pee;

  let open = false;
  let amount = pee.amount;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>
  <PeeIcon {pee} />
</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <PeeAmountInput bind:amount />
      </article>

      <button
        on:click={() => {
          updatePee({ amount, timestamp: pee.timestamp });
          setClosed();
        }}
      >
        edit
      </button>
      <button
        on:click={() => {
          removePee(pee.timestamp);
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
