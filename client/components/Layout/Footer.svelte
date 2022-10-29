<script lang="ts">
  import FeedAdd from "../Feed/FeedAdd.svelte";
  import NapAdd from "../Nap/NapAdd.svelte";
  import PeeAdd from "../Pee/PeeAdd.svelte";
  import PoopAdd from "../Poop/PoopAdd.svelte";

  export let babyId: string;
  export let userId: string;
</script>

<footer>
  <FeedAdd {babyId} {userId} />
  <NapAdd {babyId} {userId} />
  <PeeAdd {babyId} {userId} />
  <PoopAdd {babyId} {userId} />
</footer>

<style>
  footer {
    position: fixed;
    bottom: 0;
    bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: var(--action-bar-height);
    background-color: hsl(
      var(--background-color-hue),
      var(--background-color-saturation),
      calc(var(--background-color-lightness) + 10%)
    );

    border-top: var(--border);
    border-bottom: var(--border);
  }
</style>
