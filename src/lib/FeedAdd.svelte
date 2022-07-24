<script lang="ts">
  import { addFeed, type FeedKind, type FeedSide } from "./feeds";

  let open = false;

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
    <button on:click={() => addFeed({ kind: "bottle", amount: 1 })}>🍼</button>
    <button on:click={() => addFeed({ kind: "breast", amount: 1, side: "L" })}>
      🤱L
    </button>
    <button on:click={() => addFeed({ kind: "breast", amount: 1, side: "R" })}>
      🤱R
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
    background: #fff;
    padding: 0.5rem;
  }
</style>
