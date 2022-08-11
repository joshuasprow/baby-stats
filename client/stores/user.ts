import { auth, firestore } from "$firebase";
import {
  doc,
  GoogleAuthProvider,
  onAuthStateChanged,
  setDoc,
  signInWithPopup,
  signOut as _signOut,
  Timestamp,
  type User as AuthUser,
  type UserInfo,
} from "baby-stats-firebase";
import { ProviderData, User } from "baby-stats-models/users";
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

const parseTimeStringField = (
  json: object,
  field: "createdAt" | "lastLoginAt"
) => {
  if (!hasProperty(json, "createdAt")) {
    throw new Error(`User has no ${field}`);
  }

  const string = (json as any)[field];

  if (typeof string !== "string") {
    throw new Error(`User ${field} is not a string`);
  }

  const millis = parseInt(string);

  return Timestamp.fromMillis(millis);
};

const parseUser = (_user: AuthUser) => {
  const json = _user.toJSON();

  if (!hasProperty(json, "lastLoginAt")) {
    throw new Error("User has no lastLoginAt");
  }
  if (!hasProperty(json, "email")) {
    throw new Error("User has no email");
  }

  const createdAt = parseTimeStringField(json, "createdAt");
  const lastLoginAt = parseTimeStringField(json, "lastLoginAt");

  console.log({ createdAt, lastLoginAt });

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
