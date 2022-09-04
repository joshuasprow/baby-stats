import { Theme, ThemeAdd } from "baby-stats-models/theme";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

// TODO: figure out why  colors are coming back empty
export const getThemesCollection = (db: Firestore, uid: string) => {
  const path = `users/${uid}/colors`;
  console.log({ path });
  return collection(db, path);
};

export const getThemeRef = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/colors/${id}`);

export const subscribeToThemes = (
  db: Firestore,
  uid: string,
  set: (colors: Theme[]) => void,
) => {
  set([]);

  onSnapshot(
    query(getThemesCollection(db, uid), orderBy("timestamp", "desc")),
    (snap) => {
      const themes: Theme[] = [];
      snap.forEach((doc) => {
        try {
          themes.push(Theme.parse(doc.data()));
        } catch (error) {
          console.error(error);
        }
      });
      set(themes);
    },
  );
};

export const addTheme = async (db: Firestore, uid: string, value: ThemeAdd) => {
  const add = ThemeAdd.parse({ ...value });

  const ref = doc(getThemesCollection(db, uid));
  const color = Theme.parse({ ...add, id: ref.id });

  await setDoc(ref, color);

  return color;
};

export const updateTheme = async (db: Firestore, uid: string, value: Theme) => {
  const color = Theme.parse({ ...value });
  const ref = getThemeRef(db, uid, color.id);

  await updateDoc(ref, color);
};

export const removeTheme = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getThemeRef(db, uid, id));
};
