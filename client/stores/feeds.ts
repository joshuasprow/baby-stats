import { db } from "$firebase";
import { subscribeToFeeds } from "@baby-stats/firebase/feeds";
import { getTimeRangeDiffInMinutes, getTimeRangeFromMinutes } from "$lib/dates";
import type { Feed } from "$models/feeds";
import type { Timestamp } from "@firebase/firestore";
import { derived, writable } from "svelte/store";
import { baby } from "./baby";

export const feedsLoaded = writable(false);

export const feeds = derived<typeof baby, null | Feed[]>(baby, ($baby, set) => {
  let unsubscribe = () => {};

  if (!$baby) {
    set(null);
    return unsubscribe;
  }

  const { id } = $baby;

  unsubscribe = subscribeToFeeds(db, id, set);

  feedsLoaded.set(true);

  return unsubscribe;
});

export const convertAmountToBreast = (
  amount: Feed["amount"],
  timestamp: Timestamp,
) => {
  if (typeof amount !== "number") return amount;

  return getTimeRangeFromMinutes(timestamp, amount * 5);
};

export const convertAmountToBottle = (amount: Feed["amount"]) => {
  if (typeof amount === "number") return amount;

  return getTimeRangeDiffInMinutes(amount) / 5;
};
