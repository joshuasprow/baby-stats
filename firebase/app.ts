import { initializeApp as initializeFirebaseApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import type { FirebaseOptions } from "./options";

export const initializeApp = (options: FirebaseOptions) => {
  const app = initializeFirebaseApp(options);

  return { auth: getAuth(app), db: getFirestore(app) };
};
