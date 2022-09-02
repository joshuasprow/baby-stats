import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp;

export let auth: Auth;
export let firestore: Firestore;

export const initialize = (options: FirebaseOptions) => {
  app = initializeApp(options);
  auth = getAuth(app);
  firestore = getFirestore(app);
};

export type { FirebaseOptions } from "firebase/app";
export {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
  type UserInfo,
} from "firebase/auth";
export {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  Transaction,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
