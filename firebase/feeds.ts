import { Feed, FeedAdd } from "baby-stats-models/feeds";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./index";

export const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

export const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

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
