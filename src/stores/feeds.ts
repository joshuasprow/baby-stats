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
import { get, writable } from "svelte/store";
import { firestore } from "../lib/firebase";
import { Feed } from "./feeds.types";
import { newTimestampWithPickerDate } from "./picker-date";
import { user } from "./user";

export const feeds = writable<Feed[]>([]);

const feedsCollection = (uid: string) =>
  query(
    collection(firestore, `users/${uid}/feeds`),
    orderBy("timestamp", "desc")
  );

const feedsQuery = (uid: string, timestamp: Date) =>
  `users/${uid}/feeds/${timestamp.getTime()}`;

export const addFeed = (value: object) => {
  const $user = get(user);

  if (!$user) {
    console.error("No user found");
    return;
  }

  const feed = Feed.parse({
    ...value,
    timestamp: newTimestampWithPickerDate(),
  });

  setDoc(doc(firestore, feedsQuery($user.uid, feed.timestamp)), feed);
};

export const updateFeed = (value: object) => {
  const $user = get(user);

  if (!$user) {
    console.error("No user found");
    return;
  }

  const feed = Feed.parse(value);

  setDoc(doc(firestore, feedsQuery($user.uid, feed.timestamp)), feed);
};

export const removeFeed = (timestamp: Date) => {
  const $user = get(user);

  if (!$user) {
    console.error("No user found");
    return;
  }

  deleteDoc(doc(firestore, feedsQuery($user.uid, timestamp)));
};

const validateFeedDoc = (doc: QueryDocumentSnapshot<DocumentData>): Feed => {
  const data = doc.data();
  const timestamp = (data.timestamp as Timestamp).toDate();

  const feed = Feed.parse({ ...data, timestamp });

  return feed;
};

let subscribed = false;

user.subscribe(($user) => {
  if (subscribed) return;

  if (!$user) return;

  const unsubscribe = onSnapshot(feedsCollection($user.uid), (snap) =>
    feeds.set(snap.docs.map(validateFeedDoc))
  );

  subscribed = true;

  return unsubscribe;
});
