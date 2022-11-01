import dotenv from "dotenv";

dotenv.config();

import admin from "firebase-admin";
import { _1667346173_mergeEntriesCollections } from "./migrations/1667346173_merge-entries-collections";

const main = async () => {
  const projectId = process.env.FIRESTORE_PROJECT_ID;
  const userId = process.env.FIRESTORE_UID;
  const babyId = process.env.FIRESTORE_BABY_ID;

  const app = admin.initializeApp({ projectId });
  const db = app.firestore();

  if (!projectId || !userId || !babyId) {
    throw new Error("Missing config");
  }

  await _1667346173_mergeEntriesCollections(db, { babyId, userId });
};

try {
  main();
} catch (error) {
  console.error(error);
}
