import dotenv from "dotenv";

dotenv.config();

import { ENTRY_KINDS } from "@baby-stats/models/entries";
import admin from "firebase-admin";
import { Paths } from "./path";

const config = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  userId: process.env.FIRESTORE_UID,
  babyId: process.env.FIRESTORE_BABY_ID,
};

const app = admin.initializeApp({ projectId: config.projectId });
const db = app.firestore();

const main = async () => {
  const paths: Paths[] = ENTRY_KINDS.map((kind) => ({
    source: kind,
    target: kind,
  }));
};

try {
  main();
} catch (error) {
  console.error(error);
}
