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
    grid-template-columns: 2fr 3fr 2fr;
    align-items: center;
    margin: 0;
    width: 100%;
  }
</style>
