import dotenv from "dotenv";

dotenv.config();

import { ENTRY_KINDS } from "@baby-stats/models/entries";
import admin from "firebase-admin";
import { Paths } from "./models";
import { migrateCollection } from "./collections";

const config = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  userId: process.env.FIRESTORE_UID,
  babyId: process.env.FIRESTORE_BABY_ID,
};

const app = admin.initializeApp({ projectId: config.projectId });
const db = app.firestore();

const main = async () => {
  const target = `entries/${config.babyId}`;

  const paths: Paths[] = ENTRY_KINDS.map((kind) => ({
    source: `babies/${config.babyId}/${kind}`,
    target: target,
  }));

  for (const p of paths) {
    const error = await migrateCollection(db, p);

    if (error) console.error(error);
  }
};

try {
  main();
} catch (error) {
  console.error(error);
}
