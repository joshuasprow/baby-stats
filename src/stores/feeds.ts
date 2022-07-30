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
  type DocumentData,
} from "firebase/firestore";
import { derived, get } from "svelte/store";
import { firestore } from "../lib/firebase";
import { Feed } from "./feeds.types";
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

const feedsCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/feeds`),
    orderBy("timestamp", "desc")
  );

export const feeds = derived<typeof user, Feed[]>(user, ($user, set) => {
  let unsubscribe = () => {};

  if (!$user) {
    set([]);

    return unsubscribe;
  }

  unsubscribe = onSnapshot(feedsCollection($user.uid), (snap) => {
    const $feeds = snap.docs.map(validateFeedDoc);

    set($feeds);
  });

  return unsubscribe;
});

const feedsQuery = (uid: string, timestamp: Date) =>
  `users/${uid}/feeds/${timestamp.getTime()}`;

const setFeedDoc = (uid: string, feed: Feed) =>
  setDoc(doc(firestore, feedsQuery(uid, feed.timestamp)), feed);

export const addFeed = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const feed = Feed.parse({
    ...value,
    timestamp: newTimestampWithPickerDate(),
  });

  await setFeedDoc($user.uid, feed);
};

export const updateFeed = async (value: object) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  const feed = Feed.parse(value);

  await setFeedDoc($user.uid, feed);
};

export const removeFeed = async (timestamp: Date) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(doc(firestore, feedsQuery($user.uid, timestamp)));
};

const validateFeedDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const feed = Feed.parse({ ...data, timestamp });

  return feed;
};
