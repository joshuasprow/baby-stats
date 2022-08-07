<script lang="ts" context="module">
  /**
   *  All this garbage is for switching from bottle to breast feed amounts
   */

  import TimeRangePicker from "$components/TimeRangePicker.svelte";
  import type { BreastFeedAmount } from "baby-stats-models/feeds";
  import { createEventDispatcher } from "svelte";

  type Amount = number | BreastFeedAmount;
  type Timestamp<A extends Amount> = A extends number ? Date : undefined;

  const getStartDate = <A extends Amount>(
    amount: Amount,
    timestamp: Timestamp<A>
  ) => {
    if (typeof amount !== "number") return amount.start;

    if (timestamp instanceof Date) return timestamp;

    throw new Error("timestamp must be defined if amount is a number");
  };

  /** gets end date using old amount value OR new one */
  const getEndDate = <A extends Amount>(amount: A, timestamp: Timestamp<A>) => {
    if (typeof amount !== "number") return amount.end;

    if (!(timestamp instanceof Date)) {
      throw new Error("timestamp must be defined if amount is a number");
    }

    const end = new Date(timestamp);

    end.setMinutes(
      end.getMinutes() + amount * 5 /* 5 minutes per amount "unit" */
    );

    return end;
  };
</script>

<script lang="ts">
  export let amount: Amount;
  export let loading: boolean;
  export let timestamp: Timestamp<typeof amount>;

  let start = getStartDate(amount, timestamp);
  let end = getEndDate(amount, timestamp);

  const dispatch = createEventDispatcher<{ change: BreastFeedAmount }>();

  const handleChange = (e: CustomEvent<{ start: Date; end: Date }>) => {
    dispatch("change", e.detail);
  };
</script>

<TimeRangePicker {loading} on:change={handleChange} {start} {end} />
