<script lang="ts">
  import Sider from "$components/Sider.svelte";
</script>

<header>
  <Sider buttonClass="sider-button" />
</header>

<style>
  header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--action-bar-height);
    padding: 0 0.25rem;
    background: var(--action-bar-color);
  }

  :global(.sider-button) {
    margin-left: auto;
  }
</style>
