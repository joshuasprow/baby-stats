import type { User } from "@baby-stats/models/users";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User as FirebaseUser,
  signOut as authSignOut,
} from "@firebase/auth";
import { writable } from "svelte/store";
import { z } from "zod";
import { auth, db } from "../firebase";
import logger from "../firebase/logger";
import { fixAuthUser, subscribeToUser, updateUserDoc } from "../firebase/users";
import { parseError } from "@baby-stats/lib/error";
import { setTheme } from "./theme";

let unsubscribeUser = () => {};

const parseAccessToken = (authUser: FirebaseUser) => {
  try {
    const result = z
      .object({ accessToken: z.string().nullable() })
      .parse(authUser);

    return result.accessToken;
  } catch {
    return null;
  }
};

export const user = writable<User | null | undefined>(
  undefined,
  unsubscribeUser,
);

export const accessToken = writable<string | null>(null);

onAuthStateChanged(auth, async (authUser) => {
  if (!authUser) {
    user.set(null);
    accessToken.set(null);
    return;
  }

  try {
    accessToken.set(parseAccessToken(authUser));

    const _user = await fixAuthUser(db, authUser);

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
