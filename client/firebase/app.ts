import { parseError } from "@baby-stats/lib/error";
import { initializeApp as initializeFirebaseApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import {
  enableMultiTabIndexedDbPersistence,
  enableIndexedDbPersistence,
  getFirestore,
  type Firestore,
} from "@firebase/firestore";
import logger from "../lib/logger";
import type { FirebaseOptions } from "./options";

const initializeFirestore = async (db: Firestore) => {
  let enabled = false;

  // TODO: not sure if this is necessary; i'm trying multitab persistence; if
  try {
    await enableMultiTabIndexedDbPersistence(db);
    enabled = true;
  } catch (error) {
    logger.error(parseError(error));
  }

  if (enabled) return;
  // that fails, i'll try single tab persistence
  try {
    await enableIndexedDbPersistence(db);
  } catch (error) {
    logger.error(parseError(error));
  }
};

export const initializeApp = (options: FirebaseOptions) => {
  const app = initializeFirebaseApp(options);

  const auth = getAuth(app);
  const db = getFirestore(app);

  initializeFirestore(db);

  return { auth, db };
};
