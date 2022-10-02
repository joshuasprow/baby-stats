import { Theme } from "baby-stats-models/theme";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

export const getThemesCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/themes`);

export const getThemeRef = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/themes/${id}`);

export const getTheme = async (db: Firestore, uid: string, id: string) => {
  const doc = await getDoc(getThemeRef(db, uid, id));

  return Theme.parse(doc.data());
};

const parseThemes = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
  const themes: Theme[] = [];

  for (const doc of docs) {
    try {
      themes.push(Theme.parse(doc.data()));
    } catch (error) {
      console.error(error);
    }
  }

  return themes;
};

export const getThemes = async (db: Firestore, uid: string) => {
  const snap = await getDocs(getThemesCollection(db, uid));

  if (snap.empty) return [];

  return parseThemes(snap.docs);
};

export const subscribeToThemes = (
  db: Firestore,
  uid: string,
  set: (themes: Theme[]) => void,
) => {
  set([]);

  return onSnapshot(
    query(getThemesCollection(db, uid), orderBy("name")),
    (snap) => set(parseThemes(snap.docs)),
  );
};

export const addTheme = async (db: Firestore, uid: string, value: Theme) => {
  const add = Theme.parse({ ...value });

  const ref = doc(getThemesCollection(db, uid));
  const theme = Theme.parse({ ...add, id: ref.id });

  await setDoc(ref, theme);

  return theme;
};

export const updateTheme = async (db: Firestore, uid: string, value: Theme) => {
  const theme = Theme.parse({ ...value });

  if (!theme.id) throw new Error("Theme id is required");

  const ref = getThemeRef(db, uid, theme.id);

  await updateDoc(ref, theme);
};

export const removeTheme = async (db: Firestore, uid: string, id: string) => {
  await deleteDoc(getThemeRef(db, uid, id));
};
