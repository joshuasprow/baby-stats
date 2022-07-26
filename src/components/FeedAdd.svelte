<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addFeed,
    isFeedAdd,
    type FeedKind,
    type FeedSide,
  } from "../lib/feeds";

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
        <label for="amount">
          amount:
          <input
            id="amount"
            bind:value={amount}
            type="number"
            min={0.5}
            max={6}
            step={0.5}
          />
        </label>
      </article>

      <article>
        kind:
        <label for="bottle">
          <input
            bind:group={kind}
            type="radio"
            id="bottle"
            name="kind"
            value="bottle"
          />
          bottle
        </label>

        <label for="breast">
          <input
            bind:group={kind}
            type="radio"
            id="breast"
            name="kind"
            value="breast"
          />
          breast
        </label>
      </article>

      <article>
        side:
        <label for="L">
          <input
            bind:group={side}
            disabled={kind !== "breast"}
            id="L"
            name="side"
            type="radio"
            value="L"
          />
          <span>left</span>
        </label>

        <label for="R">
          <input
            bind:group={side}
            disabled={kind !== "breast"}
            id="R"
            name="side"
            type="radio"
            value="R"
          />
          <span>right</span>
        </label>
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

  input:disabled + span {
    color: #aaa;
  }
</style>
