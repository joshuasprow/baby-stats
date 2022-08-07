import { firestore } from "$firebase";
import type { TimeRangeAmount } from "baby-stats-models/entries";
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
import { derived, get } from "svelte/store";
import { user } from "./user";

export const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

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

export const addFeed = async (value: FeedAdd) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const add = FeedAdd.parse({ ...value });
  const ref = doc(getFeedsCollection($user.uid));
  const feed = Feed.parse({ ...add, id: ref.id });

  await setDoc(ref, feed);

  return feed;
};

export const updateFeed = async (value: Feed) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const feed = Feed.parse({ ...value });
  const ref = getFeedDoc($user.uid, feed.id);

  await updateDoc(ref, feed);
};

export const removeFeed = async (id: string) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(getFeedDoc($user.uid, id));
};
