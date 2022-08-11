import { Feed, FeedAdd } from "baby-stats-models/feeds";
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
import { firestore } from "./index";

const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

const feedFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const amount = data.amount;

  if ("start" in amount) {
    amount.start = (amount.start as Timestamp).toDate();
    amount.end = (amount.end as Timestamp).toDate();
  }

  return Feed.parse({ ...data, id: doc.id, timestamp });
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
