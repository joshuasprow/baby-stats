import { DEFAULT_THEME, Theme, ThemeAdd } from "baby-stats-models/theme";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

export const getThemeCollection = (db: Firestore, uid: string) =>
  collection(db, `users/${uid}/colors`);

export const getThemeRef = (db: Firestore, uid: string, id: string) =>
  doc(db, `users/${uid}/colors/${id}`);

const handleThemeSnapshot =
  (db: Firestore, uid: string, set: (colors: Theme[]) => void) =>
  async (snap: QuerySnapshot) => {
    let colors = snap.docs.map((doc) => Theme.parse(doc.data()));

    if (colors.length > 0) return set(colors);

    const defaultColor = await addTheme(db, uid, DEFAULT_THEME);

    return set([defaultColor]);
  };

export const subscribeToTheme = (
  db: Firestore,
  uid: string,
  set: (colors: Theme[]) => void,
) =>
  onSnapshot(
    query(getThemeCollection(db, uid), orderBy("timestamp", "desc")),
    handleThemeSnapshot(db, uid, set),
  );

export const addTheme = async (db: Firestore, uid: string, value: ThemeAdd) => {
  const add = ThemeAdd.parse({ ...value });

  const ref = doc(getThemeCollection(db, uid));
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
