import { BottleFeed, BreastFeed, Feed, FeedAdd } from "baby-stats-models/feeds";
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
import { z } from "zod";
import { firestore } from "./index";

const TimeRangeDoc = z.object({
  start: z.instanceof(Timestamp),
  end: z.instanceof(Timestamp),
});

const BottleFeedDoc = BottleFeed.extend({ timestamp: z.instanceof(Timestamp) });

const BreastFeedDoc = BreastFeed.extend({
  amount: TimeRangeDoc,
  timestamp: z.instanceof(Timestamp),
});

const FeedDoc = z.discriminatedUnion("source", [BottleFeedDoc, BreastFeedDoc]);
type FeedDoc = z.infer<typeof FeedDoc>;

const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

const amountFromDoc = (amount: FeedDoc["amount"]): Feed["amount"] => {
  if (typeof amount === "number") return amount;

  return { start: amount.start.toDate(), end: amount.end.toDate() };
};

const feedFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = FeedDoc.parse(doc.data());

  const amount = amountFromDoc(data.amount);
  const timestamp = data.timestamp.toDate();

  return Feed.parse({ ...data, id: doc.id, amount, timestamp });
};

export const subscribeToFeeds = (uid: string, set: (feeds: Feed[]) => void) =>
  onSnapshot(
    query(getFeedsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map(feedFromDoc))
  );

export const addFeed = async (uid: string, value: FeedAdd) => {
  const add = FeedAdd.parse({ ...value });
  const ref = doc(getFeedsCollection(uid));
  const feed = Feed.parse({ ...add, id: ref.id });

  await setDoc(ref, feed);

  return feed;
};

export const updateFeed = async (uid: string, value: Feed) => {
  const feed = Feed.parse({ ...value });
  const ref = getFeedDoc(uid, feed.id);

  await updateDoc(ref, feed);
};

export const removeFeed = async (uid: string, id: string) => {
  await deleteDoc(getFeedDoc(uid, id));
};
