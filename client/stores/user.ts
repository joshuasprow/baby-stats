import type { User } from "@baby-stats/models/users";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
} from "@firebase/auth";
import { writable } from "svelte/store";
import { auth, db } from "../firebase";
import logger from "../firebase/logger";
import { fixAuthUser, subscribeToUser, updateUserDoc } from "../firebase/users";
import { parseError } from "../lib/error";
import { setTheme } from "./theme";

let unsubscribeUser = () => {};

export const user = writable<User | null | undefined>(
  undefined,
  unsubscribeUser,
);

onAuthStateChanged(auth, async (_authUser) => {
  if (!_authUser) {
    user.set(null);
    return;
  }

  try {
    const _user = await fixAuthUser(db, _authUser);

    await updateUserDoc(db, _user);

    unsubscribeUser = subscribeToUser(db, _user.uid, user.set, setTheme);
  } catch (e) {
    logger.error(parseError(e));

    user.set(null);
  }
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await authSignOut(auth);
};
