<script lang="ts">
  import FeedAddNext from "../Feed/FeedAddNext.svelte";
  import MedAddNext from "../Med/MedAddNext.svelte";
  import NapAddNext from "../Nap/NapAddNext.svelte";
  import PeeAdd from "../Pee/PeeAdd.svelte";
  import PoopAdd from "../Poop/PoopAdd.svelte";

  export let babyId: string;
  export let userId: string;

  // if pwa is running in standalone mode, make the footer taller to clear ios/android menu bars
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
</script>

<footer class:standalone>
  <FeedAddNext {babyId} {userId} />
  <NapAddNext {babyId} {userId} />
  <PeeAdd {babyId} {userId} />
  <PoopAdd {babyId} {userId} />
  <MedAddNext {babyId} {userId} />
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

  footer.standalone {
    height: calc(var(--action-bar-height) + 1rem);
    padding: 0.25rem 0 0 0;
    align-items: flex-start;
  }
</style>
