import { Feed, FeedAdd } from "@baby-stats/models/feeds";
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

const getFeedsCollection = (db: Firestore, babyId: string) =>
  collection(db, `babies/${babyId}/feeds`);

const getFeedDoc = (db: Firestore, babyId: string, id: string) =>
  doc(db, `babies/${babyId}/feeds/${id}`);

export const subscribeToFeeds = (
  db: Firestore,
  babyId: string,
  set: (feeds: Feed[]) => void
) =>
  onSnapshot(
    query(getFeedsCollection(db, babyId), orderBy("timestamp", "desc")),
    { includeMetadataChanges: true },
    (snap) => set(snap.docs.map((doc) => Feed.parse(doc.data())))
  );

export const addFeed = async (
  db: Firestore,
  babyId: string,
  value: FeedAdd
) => {
  const add = FeedAdd.parse({ ...value });
  const ref = doc(getFeedsCollection(db, babyId));
  const feed = Feed.parse({ ...add, id: ref.id });

  await setDoc(ref, feed);

  return feed;
};

export const updateFeed = async (
  db: Firestore,
  babyId: string,
  value: Feed
) => {
  const feed = Feed.parse({ ...value });
  const ref = getFeedDoc(db, babyId, feed.id);

  await updateDoc(ref, feed);
};

export const removeFeed = async (db: Firestore, babyId: string, id: string) => {
  await deleteDoc(getFeedDoc(db, babyId, id));
};
