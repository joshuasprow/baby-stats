import * as functions from "firebase-functions";
import { Feed } from "baby-stats-models/feeds";
import * as admin from "firebase-admin";

const { logger } = functions;

const app = admin.initializeApp();
const db = app.firestore();

const getFeeds = async (uid: string) => {
  const col = await db.collection(`users/${uid}/feeds`).get();
  const feeds: Feed[] = [];

  for (const doc of col.docs) {
    try {
      const feed = Feed.parse(doc.data());

      feeds.push(feed);
    } catch (error) {
      logger.error("error parsing feed", { id: doc.id, error });

      return feeds;
    }
  }
  return feeds;
};

export const onFeedWrite = functions.firestore
  .document("users/{uid}/feeds/{feedId}")
  .onWrite(async (change, context) => {
    const feeds = await getFeeds(context.params.uid);

    logger.info(`Got ${feeds.length} feeds`, {
      feeds,
      feed: change.after.data(),
    });
  });

// type SnapshotUrl = `/users/{userId}/${EntryKind}/{entryId}`;

// type SnapshotResult<K extends EntryKind> =
//   | [entry: Entry<K>, error: null]
//   | [entry: null, error: Error];

// type SnapshotCallback<K extends EntryKind> = (
//   uid: string,
//   result: SnapshotResult<K>
// ) => void;

// const getSnapshotUrl = (kind: EntryKind): SnapshotUrl =>
//   `/users/{userId}/${kind}/{entryId}`;

// // TODO: get all entry types for the user and make a snapshot
// // then, put it in a json file in storage
// // also make a record in firestore
// const getTakeSnapshotHandler = <K extends EntryKind>(
//   kind: K,
//   callback: SnapshotCallback<K>
// ) => {
//   const url = getSnapshotUrl(kind);

//   return firestore.document(url).onWrite(async (change, context) => {});
// };
