import { parseError } from "@baby-stats/lib/error";
import type { User } from "@baby-stats/models/users";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
} from "@firebase/auth";
import { writable } from "svelte/store";
import { setGlobalError } from "../components/GlobalError.svelte";
import { auth, db } from "../firebase";
import { fixAuthUser, subscribeToUser, updateUserDoc } from "../firebase/users";
import logger from "../lib/logger";
import { setTheme } from "./theme";

let unsubscribeUser = () => {};

export const user = writable<User | null | undefined>(
  undefined,
  unsubscribeUser,
);

onAuthStateChanged(auth, async (authUser) => {
  if (!authUser) {
    user.set(null);

    return;
  }

  try {
    const _user = await fixAuthUser(db, authUser);

    await updateUserDoc(db, _user);

    unsubscribeUser = subscribeToUser(db, _user.uid, user.set, setTheme);
  } catch (e) {
    user.set(null);

    const error = parseError(e, "SubscribeToBabyError");

    logger.error(error);
    setGlobalError(error);

    unsubscribeUser = () => {};
  }
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await authSignOut(auth);
};
