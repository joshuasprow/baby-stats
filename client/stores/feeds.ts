import { firestore } from "$firebase";
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
import { derived, get } from "svelte/store";
import { user } from "./user";

export const getFeedsCollection = (uid: string) =>
  collection(firestore, `users/${uid}/feeds`);

const getFeedDoc = (uid: string, id: string) =>
  doc(firestore, `users/${uid}/feeds/${id}`);

const feedFromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const feed = Feed.parse({ ...data, id: doc.id, timestamp });

  return feed;
};

export const feeds = derived<typeof user, Feed[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  const { uid } = $user;

  unsubscribe = onSnapshot(
    query(getFeedsCollection(uid), orderBy("timestamp", "desc")),
    (snap) => {
      const $feeds = snap.docs.map(feedFromDoc);

      set($feeds);
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
