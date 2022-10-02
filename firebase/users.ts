import { DEFAULT_THEME, Theme } from "baby-stats-models/theme";
import { ProviderData, User } from "baby-stats-models/users";
import type { User as FirebaseUser, UserInfo } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
  type Firestore,
} from "firebase/firestore";
import { z } from "zod";
import { addTheme, getTheme, getThemes } from "./themes";

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

  // TODO: make this less messy
  const [defaults, user] = await Promise.all([
    getUserDefaults(db, authUser.uid, (authUser as unknown as User).themeId),
    getUserDoc(db, authUser.uid),
  ]);

  let themeId = defaults.themeId;

  if (!defaults.themeId) {
    const theme = await addTheme(db, authUser.uid, DEFAULT_THEME);
    themeId = theme.id;
  }

  return User.parse({
    ...user,
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

export const getUserDoc = async (db: Firestore, uid: string) => {
  const doc = await getDoc(getUserRef(db, uid));

  if (!doc.exists()) return null;

  return User.parse(doc.data());
};

export const updateUserDoc = async (
  db: Firestore,
  update: Pick<User, "uid"> & Partial<User>,
) => {
  const ref = getUserRef(db, update.uid);

  await updateDoc(ref, update);
};

export const subscribeToUser = (
  db: Firestore,
  uid: string,
  setUser: (user: null | User) => void,
  setTheme: (theme: Theme) => void,
) =>
  onSnapshot(getUserRef(db, uid), async (doc) => {
    if (!doc.exists()) {
      setUser(null);
      return;
    }

    const user = User.parse(doc.data());

    setUser(user);

    if (!user.themeId) return;

    const theme = await getTheme(db, uid, user.themeId);

    setTheme(theme);
  });
