import { parseError } from "@baby-stats/lib/error";
import { initializeApp as initializeFirebaseApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import {
  enableMultiTabIndexedDbPersistence,
  getFirestore,
} from "@firebase/firestore";
import logger from "../lib/logger";
import { FirebaseOptions } from "./options";

const projectId = import.meta.env.VITE_PROJECT_ID;

const options = FirebaseOptions.parse({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
});

const app = initializeFirebaseApp(options);

export const auth = getAuth(app);
export const db = getFirestore(app);

enableMultiTabIndexedDbPersistence(db).catch((error) =>
  logger.error(parseError(error)),
);
