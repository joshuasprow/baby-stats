import type { Feed } from "@baby-stats/models/feeds";
import type { Timestamp } from "@firebase/firestore";
import { getTimeRangeDiffInMinutes, getTimeRangeFromMinutes } from "lib/dates";
import { derived, writable } from "svelte/store";
import { db } from "../firebase";
import { subscribeToFeeds } from "../firebase/feeds";
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
