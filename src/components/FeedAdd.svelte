<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addFeed,
    isFeedAdd,
    type FeedKind,
    type FeedSide,
  } from "../stores/feeds";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  let open = false;

  let amount = 1;
  let kind: FeedKind = "bottle";
  let side: FeedSide | undefined = "L";

  $: if (kind === "bottle") {
    side = undefined;
  }

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>🍼</button>

{#if open}
  <aside on:click={setClosed} transition:fade={{ duration: 100 }}>
    <section on:click|stopPropagation>
      <article>
        <FeedAmountInput bind:amount />
      </article>

      <article>
        kind:
        <FeedKindInput bind:kind />
      </article>

      <article>
        side:
        <FeedSideInput {kind} bind:side />
      </article>

      <button
        on:click={() => {
          const feed = { amount, kind, side };

          if (!isFeedAdd(feed)) {
            console.error("invalid feed", feed);
            return;
          }

          addFeed(feed);
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
