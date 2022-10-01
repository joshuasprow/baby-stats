import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
  type User as FirebaseUser,
} from "@firebase/auth";
import { getTheme } from "baby-stats-firebase/themes";
import { fixAuthUser } from "baby-stats-firebase/users";
import { DEFAULT_THEME } from "baby-stats-models/theme";
import type { User } from "baby-stats-models/users";
import type { Firestore } from "firebase/firestore";
import { writable } from "svelte/store";
import { auth, db } from "../firebase";
import { setTheme } from "./theme";

const getUserTheme = async (
  db: Firestore,
  user: Pick<User, "uid" | "themeId">,
) => {
  if (!user.themeId) return null;

  return getTheme(db, user.uid, user.themeId);
};

const authUser = writable<FirebaseUser | null>(null);

onAuthStateChanged(auth, authUser.set);

export const user = writable<User | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    if (!authUser) {
      set(null);
      return;
    }

    const _user = await fixAuthUser(db, authUser);
    const _theme = await getUserTheme(db, _user);

    set(_user);
    setTheme(_theme || DEFAULT_THEME);
  });

  return unsubscribe;
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await authSignOut(auth);
};
