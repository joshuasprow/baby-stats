<script lang="ts">
  import Layout from "./components/Layout.svelte";
</script>

<Layout />

<style global>
  :root {
    font-family: sans-serif;
    font-size: 24px;
    line-height: 32px;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;

    --action-bar-color: rgba(255, 255, 255, 0.7);
    --action-bar-height: 54px;
  }

  body {
    margin: 0;
  }

  button,
  input {
    font-size: 1rem;
  }
</style>
