import { readable } from "svelte/store";
import type { Auth, User } from "firebase/auth";

const createUser = () => {
  let auth: Auth;

  const { subscribe } = readable<User | null | undefined>(undefined, (set) => {
    let unsubscribe = () => {};

    const init = async () => {
      const { app } = await import("../lib/firebase");
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");

      auth = getAuth(app);

      unsubscribe = onAuthStateChanged(auth, set);
    };

    init();

    return unsubscribe;
  });

  const sign_in = async () => {
    const { signInWithPopup, GoogleAuthProvider } = await import(
      "firebase/auth"
    );
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const sign_out = async () => {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  };

  return {
    subscribe,
    sign_in,
    sign_out,
  };
};

export const user = createUser();
