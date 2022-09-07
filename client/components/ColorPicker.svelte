<script context="module" lang="ts">
  let count = 0;

  const getId = () => {
    count += 1;
    return `color-picker-${count}`;
  };
</script>

<script lang="ts">
  import { setTheme, theme } from "$stores/theme";
  import type { ChangeEvent } from "baby-stats-lib/dom";
  import { hexToHsl, hslToHex } from "baby-stats-lib/theme";
  import type { Theme, ThemeElement } from "baby-stats-models/theme";

  type E = $$Generic<ThemeElement>;

  let id = getId();
  export let element: E;
  export let value: Theme[E];

  let hex = hslToHex(value);
  let hsl = hexToHsl(hex);

  const handleChange = (e: ChangeEvent) => {
    hex = e.currentTarget.value;
    hsl = hexToHsl(hex);
    setTheme({ ...$theme, [element]: hsl });
  };
</script>

<label for={id}>
  {element}
  <input
    {id}
    type="color"
    on:change={handleChange}
    on:input={handleChange}
    value={hex}
  />
</label>

<style>
  label {
    display: block;
  }
</style>
