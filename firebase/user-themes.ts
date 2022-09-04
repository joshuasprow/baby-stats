import { getDoc, getDocs, type Firestore } from "@firebase/firestore";
import { Theme, DEFAULT_THEME } from "baby-stats-models/theme";
import type { User } from "baby-stats-models/users";
import { addTheme, getThemeCollection, getThemeRef } from "./themes";
import { updateUserDoc } from "./users";

export const getUserTheme = async (
  db: Firestore,
  uid: string,
  themeId: string,
) => {
  const doc = await getDoc(getThemeRef(db, uid, themeId));

  return Theme.parse(doc.data());
};

export const getUserThemes = async (db: Firestore, uid: string) => {
  const docs = await getDocs(getThemeCollection(db, uid));

  const themes: Theme[] = [];

  docs.forEach((doc) => {
    try {
      themes.push(Theme.parse(doc.data()));
    } catch (error) {
      console.error(error);
    }
  });

  return themes;
};

/**
 * gets the user's theme. if they don't have one, set their theme id to the first
 * theme in the themes collection. otherwise, add the default theme to the
 * collection and set it as the user's default theme.
 */
export const validateUserTheme = async (
  db: Firestore,
  user: User,
): Promise<Theme> => {
  if (user.themeId) return getUserTheme(db, user.uid, user.themeId);

  const themes = await getUserThemes(db, user.uid);

  let theme: Theme;

  if (themes.length > 0) {
    theme = themes[0];
  } else {
    theme = await addTheme(db, user.uid, DEFAULT_THEME);
  }

  await updateUserDoc(db, { ...user, themeId: theme.id });

  return theme;
};

// TODO: troubleshoot flicker between user.themeId and null
