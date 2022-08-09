import { firestore } from "$firebase";
import type { TimeRangeAmount } from "baby-stats-models/time-ranges";
import {
  BreastFeed,
  Feed,
  FeedAdd,
  type FeedSource,
} from "baby-stats-models/feeds";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { derived, get, writable } from "svelte/store";
import { user } from "./user";
import {
  getTimeRangeFromMinutes,
  getTimeRangeDiffInMinutes,
} from "baby-stats-lib/dates";

// TODO: remove this after migrating all feed records
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

// TODO: remove this after migrating all feed records
let FEED_FIX_QUEUE: BreastFeed[] = [];

const feedFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();
  const source = data.source as FeedSource;

  let amount = data.amount;
  let fixed = false;

  if (source === "breast") {
    const f = fixOldBreastFeedAmount(data.amount, timestamp);
    amount = f[0];
    fixed = f[1];
  }

  const feed = Feed.parse({ ...data, amount, id: doc.id, timestamp });

  if (feed.source === "breast" && fixed) {
    FEED_FIX_QUEUE.push(feed);
  }

  return feed;
};

export const feedsLoaded = writable(false);

export const feeds = derived<typeof user, Feed[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  const { uid } = $user;

  let updating = false;

  unsubscribe = onSnapshot(
    query(getFeedsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => {
      FEED_FIX_QUEUE = [];

      const $feeds = snap.docs.map(feedFromDoc);

      set($feeds);

      feedsLoaded.set(true);

      if (FEED_FIX_QUEUE.length === 0) return;
      if (updating) {
        console.log("breast feeds already updating");
        return;
      }

      console.log(`updating ${FEED_FIX_QUEUE.length} fixed breast feeds`);
      updating = true;

      Promise.all(FEED_FIX_QUEUE.map(updateFeed))
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          updating = false;
          console.log(`updated  ${FEED_FIX_QUEUE.length} fixed breast feeds`);
        });
    }
  );

  return unsubscribe;
});

export const convertAmountToBreast = (
  amount: Feed["amount"],
  timestamp: Date
) => {
  if (typeof amount !== "number") return amount;

  return getTimeRangeFromMinutes(timestamp, amount * 5);
};

export const convertAmountToBottle = (amount: Feed["amount"]) => {
  if (typeof amount === "number") return amount;

  return getTimeRangeDiffInMinutes(amount) / 5;
};
