import { auth, firestore } from "$firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as _signOut,
  type User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { readable } from "svelte/store";

const getUserDoc = (uid: string) => doc(firestore, `users/${uid}`);

const updateUserDoc = async (_user: User) => {
  try {
    const ref = getUserDoc(_user.uid);

    await setDoc(ref, user);
  } catch (error) {
    console.error(error);
  }
};

export const user = readable<User | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (_user) => {
    set(_user);

    if (!_user) return;

    await updateUserDoc(_user);
  });

  return unsubscribe;
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await _signOut(auth);
};
