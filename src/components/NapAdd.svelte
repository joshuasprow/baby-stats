<script lang="ts">
  import { fade } from "svelte/transition";
  import { addNap } from "../stores/naps";
  import NapAmountInput from "./NapAmountInput.svelte";

  let open = false;
  let amount = 2;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>💤</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <NapAmountInput bind:amount />
      </article>

      <button
        on:click={() => {
          addNap({ amount });
          setClosed();
        }}
      >
        add
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
