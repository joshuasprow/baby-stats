import dotenv from "dotenv";

dotenv.config();

import admin from "firebase-admin";
import { deleteCollection } from "./collections.js";

const app = admin.initializeApp({
  projectId: process.env.FIRESTORE_PROJECT_ID,
});
const db = app.firestore();

const UID = process.env.FIRESTORE_UID;
const BABY_ID = process.env.FIRESTORE_BABY_ID;

const PATHS = {
  feeds: {
    baby: `babies/${BABY_ID}/feeds`,
    user: `users/${UID}/feeds`,
  },
};

const getFeeds = async () => {
  const collection = db.collection(PATHS.feeds.user);
  const docs = await collection.get();

  return docs.docs.map((doc) => doc.data());
};

const updateFeeds = async (feeds) => {
  const collection = db.collection(PATHS.feeds.baby);

  let batch = db.batch();
  let count = 0;

  for (const feed of feeds) {
    const ref = collection.doc(feed.id);

    batch.set(ref, feed);

    count += 1;

    if (count === 500) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  await batch.commit();
};

const main = async () => {
  try {
    await deleteCollection(db, PATHS.feeds.baby);

    const feeds = await getFeeds();

    await updateFeeds(feeds);
  } catch (error) {
    console.error(error);
  }
};

main();
