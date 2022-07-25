<script lang="ts">
  import { fade } from "svelte/transition";
  import { addFeed, isFeedAdd, type FeedKind, type FeedSide } from "./feeds";

  let open = false;

  let amount = 1;
  let kind: FeedKind = "bottle";
  let side: FeedSide = "L";

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

      {#if kind === "breast"}
        <article>
          side:
          <label for="L">
            <input
              bind:group={side}
              type="radio"
              id="L"
              name="side"
              value="L"
            />
            left
          </label>

          <label for="R">
            <input
              bind:group={side}
              type="radio"
              id="R"
              name="side"
              value="R"
            />
            right
          </label>
        </article>
      {/if}

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
