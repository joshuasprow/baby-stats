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
  type Firestore,
} from "firebase/firestore";

const getFeedsCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/feeds`);

const getFeedDoc = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/feeds/${id}`);

export const subscribeToFeeds = (
  db: Firestore,
  uid: string,
  set: (feeds: Feed[]) => void,
) =>
  onSnapshot(
    query(getFeedsCollection(db, uid), orderBy("timestamp", "desc")),
    (snap) => set(snap.docs.map((doc) => Feed.parse(doc.data()))),
  );

export const addFeed = async (db: Firestore, uid: string, value: FeedAdd) => {
  const add = FeedAdd.parse({ ...value });
  const ref = doc(getFeedsCollection(db, uid));
  const feed = Feed.parse({ ...add, id: ref.id });

  await setDoc(ref, feed);

  return feed;
};

export const updateFeed = async (db: Firestore, uid: string, value: Feed) => {
  const feed = Feed.parse({ ...value });
  const ref = getFeedDoc(db, uid, feed.id);

  await updateDoc(ref, feed);
};

export const removeFeed = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getFeedDoc(db, uid, id));
};
