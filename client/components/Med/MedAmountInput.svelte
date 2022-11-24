<script lang="ts">
  import { MedUnit, type Med } from "@baby-stats/models/meds";
  import { createEventDispatcher } from "svelte";
  import logger from "../../firebase/logger";
  import type { InputEvent, SelectEvent } from "../../lib/dom";

  export let amount = 2;
  export let unit: MedUnit = "ml";
  export let loading: boolean;

  const dispatch = createEventDispatcher<{
    change: Pick<Med, "amount" | "unit">;
  }>();

  const handleAmountChange = (e: InputEvent) => {
    const value = parseInt(e.currentTarget.value);

    if (typeof value !== "number") {
      logger.error(new Error(`invalid amount: ${value} (${typeof value})`));
      return;
    }

    amount = value;

    dispatch("change", { amount, unit });
  };

  const handleUnitChange = (e: SelectEvent) => {
    const value = e.currentTarget.value;

    unit = MedUnit.parse(value);

    dispatch("change", { amount, unit });
  };
</script>

<label for="amount">
  amount:
  <input
    class:loading
    id="amount"
    on:change={handleAmountChange}
    on:focus={(e) => e.currentTarget.select()}
    type="number"
    pattern="[0–9]*"
    inputmode="decimal"
    value={amount}
  />

  <select class:loading on:change={handleUnitChange} value={unit}>
    {#each Object.keys(MedUnit.Values) as unit}
      <option value={unit}>{unit}</option>
    {/each}
  </select>
</label>

<style>
  input {
    max-width: 6ch;
  }

  .loading {
    filter: grayscale(100%);
    cursor: not-allowed;
  }
</style>
