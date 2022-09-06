import type { User as FirebaseUser, UserInfo } from "@firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  type Firestore,
} from "@firebase/firestore";
import { DEFAULT_THEME } from "baby-stats-models/theme";
import { AuthUser, ProviderData, User } from "baby-stats-models/users";
import { z } from "zod";
import { addTheme, getThemes } from "./themes";

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

const getUserDefaults = async (
  db: Firestore,
  uid: string,
  themeId: undefined | null | string,
) => {
  if (themeId) return { themeId };

  const themes = await getThemes(db, uid);

  if (themes.length) {
    return { themeId: themes[0].id };
  }

  return { themeId: null };
};

/** Validates an incoming user object, setting defaults for fields that are
 * undefined or invalid */
export const fixAuthUser = async (
  db: Firestore,
  authUser: FirebaseUser,
): Promise<User> => {
  const json = authUser.toJSON();

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

  let { themeId } = await getUserDefaults(
    db,
    authUser.uid,
    (authUser as unknown as User).themeId,
  );

  if (!themeId) {
    const theme = await addTheme(db, authUser.uid, DEFAULT_THEME);
    themeId = theme.id;
  }

  return User.parse({
    uid: authUser.uid,
    email,
    emailVerified: authUser.emailVerified,
    displayName: authUser.displayName,
    isAnonymous: authUser.isAnonymous,
    photoURL: authUser.photoURL,
    providerData: authUser.providerData.map(parseProviderData),
    createdAt,
    lastLoginAt,
    themeId,
  });
};

const getUserRef = (db: Firestore, uid: string) => doc(db, `users/${uid}`);

export const getUserDoc = async (db: Firestore, uid: string): Promise<User> => {
  const doc = await getDoc(getUserRef(db, uid));

  return User.parse(doc.data());
};

export const updateUserDoc = async (
  db: Firestore,
  user: Pick<User, "uid"> & Partial<User>,
) => {
  const ref = getUserRef(db, user.uid);

  await setDoc(ref, user);

  const doc = await getDoc(ref);

  return User.parse(doc.data());
};
