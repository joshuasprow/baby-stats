<script lang="ts">
  interface $$Slots {
    default: Node[];
  }
</script>

<figure>
  {#if $$slots.left}
    <slot name="left" />
  {:else}
    <span />
  {/if}
  {#if $$slots.middle}
    <slot name="middle" />
  {:else}
    <span />
  {/if}
  {#if $$slots.right}
    <slot name="right" />
  {:else}
    <span />
  {/if}
</figure>

<style>
  figure {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 0;
  }
</style>
