import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
} from "@firebase/auth";
import { addTheme, getThemes } from "baby-stats-firebase/themes";
import {
  fixAuthUser,
  updateUserDoc,
  getUserDoc,
} from "baby-stats-firebase/users";
import { DEFAULT_THEME } from "baby-stats-models/theme";
import type { User } from "baby-stats-models/users";
import { readable } from "svelte/store";
import { auth, db } from "../firebase";

export const user = readable<User | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    if (!authUser) {
      set(authUser);
      return;
    }

    let user = await getUserDoc(db, authUser.uid);

    const fixed = fixAuthUser(db, authUser);

    user = await updateUserDoc(db, { ...user, ...fixed });

    set(user);
  });

  return unsubscribe;
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await authSignOut(auth);
};
