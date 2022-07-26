<script lang="ts">
  import { fade } from "svelte/transition";
  import { isPee, removePee, updatePee, type Pee } from "../stores/pees";
  // import PeeAmountInput from "./PeeAmountInput.svelte";
  // import PeeIcon from "./PeeIcon.svelte";
  // import PeeSideInput from "./PeeSideInput.svelte";

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
  <!-- <PeeIcon feed={pee} /> -->
</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <!-- <PeeAmountInput bind:amount /> -->
      </article>

      <article>
        kind:
        <!-- <PeeKindInput bind:kind /> -->
      </article>

      <article>
        side:
        <!-- <PeeSideInput {kind} bind:side /> -->
      </article>

      <button
        on:click={() => {
          const p = { amount, timestamp: pee.timestamp };

          if (!isPee(p)) {
            console.error("invalid pee", p);
            return;
          }

          updatePee(p);
          setClosed();
        }}
      >
        edit
      </button>
      <button on:click={() => removePee(pee.timestamp)}>remove</button>
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
