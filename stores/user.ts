import { auth, db } from "$firebase";
import { fixAuthUser, subscribeToUser, updateUserDoc } from "$firebase/users";
import type { User } from "$models/users";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as authSignOut,
} from "firebase/auth";
import { writable } from "svelte/store";
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

  const _user = await fixAuthUser(db, _authUser);

  await updateUserDoc(db, _user);

  unsubscribeUser = subscribeToUser(db, _user.uid, user.set, setTheme);
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await authSignOut(auth);
};
