import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { config } from "./config";

export const app = initializeApp(config);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
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
} from "firebase/firestore";
