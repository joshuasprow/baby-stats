import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
} from "@firebase/auth";
import { getTheme } from "baby-stats-firebase/themes";
import {
  fixAuthUser,
  getUserDoc,
  updateUserDoc,
} from "baby-stats-firebase/users";
import { DEFAULT_THEME, ThemeAdd } from "baby-stats-models/theme";
import type { User } from "baby-stats-models/users";
import type { Firestore } from "firebase/firestore";
import { readable } from "svelte/store";
import { auth, db } from "../firebase";
import { setTheme } from "./theme";

const getUserTheme = async (
  db: Firestore,
  user: Pick<User, "uid" | "themeId">,
) => {
  if (!user.themeId) return null;

  return getTheme(db, user.uid, user.themeId);
};

export const user = readable<User | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    if (!authUser) {
      set(authUser);
      return;
    }

    let _user = await getUserDoc(db, authUser.uid);
    let _theme: ThemeAdd | null = DEFAULT_THEME;

    const fixed = fixAuthUser(db, authUser);

    [_user, _theme] = await Promise.all([
      updateUserDoc(db, { ..._user, ...fixed }),
      getUserTheme(db, _user),
    ]);

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
