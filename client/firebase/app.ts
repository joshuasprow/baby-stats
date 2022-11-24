import { initializeApp as initializeFirebaseApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "@firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "@firebase/firestore";
import type { FirebaseOptions } from "./options";

export const initializeApp = (options: FirebaseOptions) => {
  const app = initializeFirebaseApp(options);

  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  enableIndexedDbPersistence(db);

  return { analytics, auth, db };
};
