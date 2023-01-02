import dotenv from "dotenv";

dotenv.config();

import admin from "firebase-admin";

const projectId = process.env.FIRESTORE_PROJECT_ID;

export const app = admin.initializeApp({ projectId });
