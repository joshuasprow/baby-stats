import { updateFeed } from "baby-stats-firebase/feeds";
import { parseError } from "baby-stats-lib/error";
import { BreastFeed } from "baby-stats-models/feeds";
import { TimeRangeAmount } from "baby-stats-models/time-ranges";
import { Timestamp } from "firebase/firestore";

let UPDATING = false;
let FEED_FIX_QUEUE: BreastFeed[] = [];

const fixOldBreastFeedAmount = (
  amount: number | { start: Timestamp; end: Timestamp },
  timestamp: Date
): [amount: TimeRangeAmount, fixed: boolean] => {
  if (typeof amount !== "number") {
    return [{ start: amount.start.toDate(), end: amount.end.toDate() }, false];
  }

  const start = new Date(timestamp);
  const end = new Date(timestamp);

  end.setMinutes(start.getMinutes() + amount * 15 /* 15 minutes per "unit" */);

  return [{ start, end }, true];
};

export const fixEntries = async (uid: string) => {
  FEED_FIX_QUEUE = [];

  if (FEED_FIX_QUEUE.length === 0) return;

  if (UPDATING) {
    console.log("breast feeds already updating");
    return;
  }

  console.log(`updating ${FEED_FIX_QUEUE.length} fixed breast feeds`);

  UPDATING = true;

  try {
    await Promise.all(FEED_FIX_QUEUE.map((fix) => updateFeed(uid, fix)));
  } catch (e) {
    return parseError(e);
  }

  UPDATING = false;
  console.log(`updated  ${FEED_FIX_QUEUE.length} fixed breast feeds`);
};
