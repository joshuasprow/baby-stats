import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as _signOut,
} from "@firebase/auth";
import { validateUser, updateUserDoc } from "baby-stats-firebase/users";
import type { User } from "baby-stats-models/users";
import { readable } from "svelte/store";
import { auth, db } from "../firebase";

export const user = readable<User | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (_user) => {
    if (!_user) {
      set(_user);
      return;
    }

    const parsed = validateUser(_user);

    set(parsed);

    await updateUserDoc(db, parsed);
  });

  return unsubscribe;
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await _signOut(auth);
};
