import { Feed, FeedAdd } from "baby-stats-models/feeds";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./index";

const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

export const subscribeToFeeds = (uid: string, set: (feeds: Feed[]) => void) =>
  onSnapshot(
    query(getFeedsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Feed.parse(doc.data()))),
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
