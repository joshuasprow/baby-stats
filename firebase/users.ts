import type { User as AuthUser, UserInfo } from "@firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  type Firestore,
} from "@firebase/firestore";
import { ProviderData, User } from "baby-stats-models/users";
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
  field: "createdAt" | "lastLoginAt",
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

/** Validates an incoming user object, setting defaults for fields that are
 * undefined or invalid */
export const validateUser = (user: AuthUser) => {
  const json = user.toJSON();

  if (!hasProperty(json, "lastLoginAt")) {
    throw new Error("User has no lastLoginAt");
  }
  if (!hasProperty(json, "email")) {
    throw new Error("User has no email");
  }

  const createdAt = parseTimeStringField(json, "createdAt");
  const lastLoginAt = parseTimeStringField(json, "lastLoginAt");

  const email = z
    .string()
    .nullable()
    .parse((json as any).email);

  return User.parse({
    uid: user.uid,
    email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    photoURL: user.photoURL,
    providerData: user.providerData.map(parseProviderData),
    createdAt,
    lastLoginAt,
    themeId: (user as unknown as User).themeId || null,
  });
};

const getUserRef = (db: Firestore, uid: string) => doc(db, `users/${uid}`);

export const getUser = async (db: Firestore, uid: string): Promise<User> => {
  const user = await getDoc(getUserRef(db, uid));

  return User.parse(user.data());
};

export const updateUserDoc = async (db: Firestore, user: User) => {
  const ref = getUserRef(db, user.uid);

  await setDoc(ref, user);
};
