<script lang="ts">
  import { fade } from "svelte/transition";

  import {
    isBreastFeed,
    isFeed,
    updateFeed,
    type Feed,
    type FeedKind,
    type FeedSide,
  } from "./feeds";

  type K = $$Generic<FeedKind>;

  export let feed: Feed<K>;

  let open = false;

  let amount = feed.amount;
  let kind: FeedKind = feed.kind;
  let side: FeedSide | undefined = isBreastFeed(feed) ? feed.side : undefined;

  $: if (kind === "bottle") {
    side = undefined;
  }

  let icon = "🚫";

  $: if (feed.kind === "bottle") {
    icon = `${feed.amount}🍼`;
  } else if (feed.kind === "breast") {
    icon = `${feed.amount}🤱${(feed as unknown as Feed<"breast">).side}`;
  }

  const setOpen = () => {
    open = true;
  };

  const setClosed = () => {
    open = false;
  };
</script>

<button on:click={setOpen}>{icon}</button>

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
          const f = { amount, kind, side, timestamp: feed.timestamp };

          if (!isFeed(f)) {
            console.error("invalid feed", f);
            return;
          }

          updateFeed(f);
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
