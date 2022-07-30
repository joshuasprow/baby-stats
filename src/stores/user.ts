import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { readable } from "svelte/store";
import { auth } from "../lib/firebase";

const createUser = () => {
  const { subscribe } = readable<User | null | undefined>(undefined, (set) => {
    let unsubscribe = () => {};

    const init = async () => {
      unsubscribe = onAuthStateChanged(auth, set);
    };

    init();

    return unsubscribe;
  });

  const sign_in = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const sign_out = async () => {
    await signOut(auth);
  };

  return {
    subscribe,
    sign_in,
    sign_out,
  };
};

export const user = createUser();
