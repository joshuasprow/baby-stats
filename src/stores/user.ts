import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "../lib/firebase";

export const user = writable<User | null>(null);

onAuthStateChanged(
  auth,
  (u) => {
    user.set(u);
  },
  (error) => {
    user.set(null);
    console.error(error);
  }
);
