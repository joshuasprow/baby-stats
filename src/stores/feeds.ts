import { newTimestampWithPickerDate } from "./picker-date";
import { addEntry, removeEntry, updateEntry } from "./days";
import { z } from "zod";
import { derived } from "svelte/store";
import { user } from "./user";
import type { Timestamp } from "firebase/firestore";

const FEED_KINDS = ["bottle", "breast"] as const;
const FEED_SIDES = z.enum(["L", "R"]);

const BOTTLE_FEED = z.object({
  timestamp: z.date(),
  kind: z.literal(FEED_KINDS[0]),
  amount: z.number(),
  side: z.null(),
});
const BREAST_FEED = z.object({
  timestamp: z.date(),
  kind: z.literal(FEED_KINDS[1]),
  amount: z.number(),
  side: FEED_SIDES,
});

const FEED = z.discriminatedUnion("kind", [BOTTLE_FEED, BREAST_FEED]);

export type FeedKind = typeof FEED_KINDS[number];
export type FeedSide = z.infer<typeof FEED_SIDES>;

export type Feed = z.infer<typeof FEED>;

type BreastFeed = z.infer<typeof BREAST_FEED>;

export const isBreastFeed = (value: unknown): value is BreastFeed => {
  try {
    BREAST_FEED.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const addFeed = async (feed: Omit<Feed, "timestamp">) => {
  const _feed = FEED.parse({
    ...feed,
    timestamp: newTimestampWithPickerDate(),
  });

  await addEntry("feeds", _feed);
};

// todo: replace unknown with a narrower type
export const updateFeed = async (feed: unknown) => {
  const _feed = FEED.parse(feed);

  await updateEntry("feeds", _feed);
};

export const removeFeed = (timestamp: Date) => removeEntry("feeds", timestamp);

const createFeeds = () => {
  const { subscribe } = derived<typeof user, Feed[]>(user, ($user, set) => {
    let unsubscribe = () => {};

    const init = async () => {
      if (!$user) {
        set([]);
        return;
      }

      const { app } = await import("../lib/firebase");
      const { getFirestore, collection, query, orderBy, onSnapshot } =
        await import("firebase/firestore");
      const firestore = getFirestore(app);

      const _query = query(
        query(
          collection(firestore, `users/${$user.uid}/feeds`),
          orderBy("timestamp", "desc")
        )
      );

      unsubscribe = onSnapshot(_query, (snap) =>
        set(
          snap.docs.map((doc) => {
            const data = doc.data();

            const feed = FEED.parse({
              ...data,
              timestamp: (data.timestamp as Timestamp).toDate(),
            });

            return feed;
          })
        )
      );
    };

    init();

    return unsubscribe;
  });

  return { subscribe };
};

export const feeds = createFeeds();
