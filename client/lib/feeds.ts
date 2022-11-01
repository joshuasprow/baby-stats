import { Feed } from "@baby-stats/models/feeds";
import type { Timestamp } from "@firebase/firestore";
import { getTimeRangeDiffInMinutes, getTimeRangeFromMinutes } from "./dates";

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
