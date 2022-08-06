import { auth, firestore } from "$firebase";
import { ProviderData, User } from "baby-stats-models/users";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as _signOut,
  type User as AuthUser,
  type UserInfo,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { readable } from "svelte/store";
import { z } from "zod";

const parseProviderData = (providerData: UserInfo): ProviderData => ({
  providerId: providerData.providerId,
  uid: providerData.uid,
  displayName: providerData.displayName,
  email: providerData.email,
  phoneNumber: providerData.phoneNumber,
  photoURL: providerData.photoURL,
});

const hasProperty = (obj: unknown, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

const dateFromJson = (string: unknown) => {
  if (typeof string !== "string") {
    throw new Error(`Expected string, got ${string} ${typeof string}`);
  }

  const unix = parseInt(string, 10);

  if (isNaN(unix)) {
    throw new Error(`Expected number, got ${string}`);
  }

  return new Date(unix);
};

const parseUser = (_user: AuthUser) => {
  const json = _user.toJSON();

  if (!hasProperty(json, "createdAt")) {
    throw new Error("User has no createdAt");
  }
  if (!hasProperty(json, "lastLoginAt")) {
    throw new Error("User has no lastLoginAt");
  }
  if (!hasProperty(json, "email")) {
    throw new Error("User has no email");
  }

  const createdAt = dateFromJson((json as any).createdAt);
  const lastLoginAt = dateFromJson((json as any).lastLoginAt);

  const email = z
    .string()
    .nullable()
    .parse((json as any).email);

  return User.parse({
    uid: _user.uid,
    email,
    emailVerified: _user.emailVerified,
    displayName: _user.displayName,
    isAnonymous: _user.isAnonymous,
    photoURL: _user.photoURL,
    providerData: _user.providerData.map(parseProviderData),
    createdAt,
    lastLoginAt,
  });
};

const getUserDoc = (uid: string) => doc(firestore, `users/${uid}`);

const updateUserDoc = async (_user: AuthUser) => {
  try {
    const ref = getUserDoc(_user.uid);
    const parsed = parseUser(_user);

    await setDoc(ref, parsed);
  } catch (error) {
    console.error(error);
  }
};

export const user = readable<AuthUser | null | undefined>(undefined, (set) => {
  const unsubscribe = onAuthStateChanged(auth, async (_user) => {
    set(_user);

    if (!_user) return;

    await updateUserDoc(_user);
  });

  return unsubscribe;
});

export const signIn = async () => {
  await signInWithPopup(auth, new GoogleAuthProvider());
};

export const signOut = async () => {
  await _signOut(auth);
};
