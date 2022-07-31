import { EntryBase } from "$lib/entry";
import { firestore } from "$lib/firebase";
import {
  addDoc,
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
import { z } from "zod";
import { user } from "./user";

const FeedSide = z.enum(["L", "R"]);
export type FeedSide = z.infer<typeof FeedSide>;

const FeedSource = ["bottle", "breast"] as const;
export type FeedSource = typeof FeedSource[number];

const BottleFeed = EntryBase.extend({
  id: z.string(),
  source: z.literal(FeedSource[0]),
  side: z.null(),
});

const BreastFeed = EntryBase.extend({
  id: z.string(),
  source: z.literal(FeedSource[1]),
  side: FeedSide,
});

const Feed = z.discriminatedUnion("source", [BottleFeed, BreastFeed]);
export type Feed = z.infer<typeof Feed>;

const FeedAdd = z.discriminatedUnion("source", [
  BottleFeed.omit({ id: true }),
  BreastFeed.omit({ id: true }),
]);
export type FeedAdd = z.infer<typeof FeedAdd>;

const getFeedsCollection = (uid: string) =>
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

  unsubscribe = onSnapshot(
    query(getFeedsCollection($user.uid), orderBy("timestamp", "desc")),
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

  console.log(ref.id);
  const feed = Feed.parse({ ...add, id: ref.id });

  await setDoc(ref, feed);

  return feed;
};

export const updateFeed = async (value: Feed) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  try {
    const feed = Feed.parse({ ...value });
    const ref = getFeedDoc($user.uid, feed.id);

    await updateDoc(ref, feed);
  } catch (error) {
    console.error(error);
  }
};

export const removeFeed = async (id: string) => {
  const $user = get(user);

  if (!$user) {
    throw new Error("No user found");
  }

  await deleteDoc(getFeedDoc($user.uid, id));
};
