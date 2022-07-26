<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    isBreastFeed,
    isFeed,
    removeFeed,
    updateFeed,
    type Feed,
    type FeedKind,
    type FeedSide,
  } from "../stores/feeds";
  import FeedAmountInput from "./FeedAmountInput.svelte";
  import FeedIcon from "./FeedIcon.svelte";
  import FeedKindInput from "./FeedKindInput.svelte";
  import FeedSideInput from "./FeedSideInput.svelte";

  type K = $$Generic<FeedKind>;

  export let feed: Feed<K>;

  let open = false;

  let amount = feed.amount;
  let kind: FeedKind = feed.kind;
  let side: FeedSide | undefined = isBreastFeed(feed) ? feed.side : undefined;

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

<button on:click={setOpen}><FeedIcon {feed} /></button>

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
          const f = { amount, kind, side, timestamp: feed.timestamp };

          if (!isFeed(f)) {
            console.error("invalid feed", f);
            return;
          }

          updateFeed(f);
          setClosed();
        }}
      >
        edit
      </button>
      <button on:click={() => removeFeed(feed.timestamp)}>remove</button>
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
