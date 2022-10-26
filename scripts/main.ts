import dotenv from "dotenv";

dotenv.config();

import admin from "firebase-admin";

const config = {
  projectId: process.env.FIRESTORE_PROJECT_ID,
  userId: process.env.FIRESTORE_UID,
  babyId: process.env.FIRESTORE_BABY_ID,
};

const app = admin.initializeApp({ projectId: config.projectId });
const db = app.firestore();

const main = async () => {
  console.log(`Hi`);
};

try {
  main();
} catch (error) {
  console.error(error);
}
