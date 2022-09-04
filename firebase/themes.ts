import { Theme, ThemeAdd } from "baby-stats-models/theme";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

export const getThemesCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/themes`);

export const getThemeRef = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/themes/${id}`);

export const subscribeToThemes = (
  db: Firestore,
  uid: string,
  set: (themes: Theme[]) => void,
) => {
  set([]);

  return onSnapshot(getThemesCollection(db, uid), (snap) => {
    const themes: Theme[] = [];

    for (const doc of snap.docs) {
      try {
        themes.push(Theme.parse(doc.data()));
      } catch (error) {
        console.error(error);
      }
    }

    set(themes);
  });
};

export const addTheme = async (db: Firestore, uid: string, value: ThemeAdd) => {
  const add = ThemeAdd.parse({ ...value });

  const ref = doc(getThemesCollection(db, uid));
  const theme = Theme.parse({ ...add, id: ref.id });

  await setDoc(ref, theme);

  return theme;
};

export const updateTheme = async (db: Firestore, uid: string, value: Theme) => {
  const theme = Theme.parse({ ...value });
  const ref = getThemeRef(db, uid, theme.id);

  await updateDoc(ref, theme);
};

export const removeTheme = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getThemeRef(db, uid, id));
};
