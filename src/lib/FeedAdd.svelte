<script lang="ts">
  import {
    addFeed,
    isFeedPartial,
    type FeedKind,
    type FeedSide,
  } from "./feeds";

  let open = true;

  let amount = 1;
  let kind: FeedKind = "bottle";
  let side: FeedSide | undefined = undefined;

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>🍼</button>

<aside class:open on:click={setClosed}>
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
          type="radio"
          id="bottle"
          name="kind"
          value="bottle"
          checked={kind === "bottle"}
          on:change={() => {
            kind = "bottle";
            side = undefined;
          }}
        />
        bottle
      </label>

      <label for="breast">
        <input
          type="radio"
          id="breast"
          name="kind"
          value="breast"
          checked={kind === "breast"}
          on:change={() => {
            kind = "breast";
            side = "L";
          }}
        />
        breast
      </label>
    </article>

    {#if kind === "breast"}
      <article>
        side:
        <label for="L">
          <input
            type="radio"
            id="L"
            name="side"
            value="L"
            checked={side === "L"}
            on:change={() => {
              side = "L";
            }}
          />
          left
        </label>

        <label for="R">
          <input
            type="radio"
            id="R"
            name="side"
            value="R"
            checked={side === "R"}
            on:change={() => {
              side = "R";
            }}
          />
          right
        </label>
      </article>
    {/if}

    <button
      on:click={() => {
        const feed = { amount, kind, side };

        if (!isFeedPartial(feed)) {
          console.error("invalid feed", feed);
          return;
        }

        addFeed(feed);
      }}
    >
      add
    </button>
  </section>
</aside>

<style>
  aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  aside.open {
    display: flex;
  }

  section {
    color: #000;
    background: #fff;
    padding: 0.5rem;
  }
</style>
